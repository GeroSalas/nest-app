import * as Redis from 'ioredis';
import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'nestjs-redis';

import UsersService from '../users/users.service';
import { SignUpDTO } from './dto/req';
import AuthContext from './interfaces/authContext';
import { ProfileUserDTO } from '../users/dto/res';
import { UpdateUserDTO } from '../users/dto/req';
import JwtPayload from './interfaces/jwtPayload';

@Injectable()
export default class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly redisClient: Redis.Redis;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.redisClient = redisService.getClient();
  }

  async registerUser(data: SignUpDTO): Promise<string> {
    const user = await this.usersService.getByUsername(data.username);
    if (user) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userId = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });
    return userId;
  }

  async validateUser(username: string, password: string): Promise<AuthContext> {
    const user = await this.usersService.getByUsername(username);
    if (!user) {
      throw new UnauthorizedException(); // this is better than returning a 404 not found
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      throw new UnauthorizedException(); // invalid credentials
    }

    // save user profile on cache for fast retrieving on future requests
    const fullUserProfile = await this.usersService.getFullProfileByID(user.id);
    await this.redisClient.set(user.id, JSON.stringify(fullUserProfile));

    const authUser: AuthContext = {
      userId: user.id,
      username: user.username,
      name: fullUserProfile.name,
    };

    this.logger.debug({ authUser }, 'New login registered');
    return authUser;
  }

  async getUserProfile(userId: string): Promise<ProfileUserDTO> {
    const cachedUser = await this.redisClient.get(userId);
    if (cachedUser) {
      const userInfo = JSON.parse(cachedUser.toString());
      this.logger.debug({ userInfo }, 'User profile from cache');
      return userInfo;
    }

    const userFromDB = await this.usersService.getFullProfileByID(userId);
    await this.redisClient.set(userId, JSON.stringify(userFromDB));
    return userFromDB;
  }

  async updateUserProfile(userId: string, data: UpdateUserDTO): Promise<ProfileUserDTO> {
    await this.usersService.update(userId, data);

    // update cache
    const userFromDB = await this.usersService.getFullProfileByID(userId);
    await this.redisClient.set(userId, JSON.stringify(userFromDB));
    return userFromDB;
  }

  async createToken(user: AuthContext): Promise<string> {
    const tokenPayload: JwtPayload = {
      ...user,
      sub: user.userId,
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      expiresIn: this.configService.get('api.jwt.signOptions.expiresIn'),
      secret: this.configService.get('api.jwt.secret'),
    });

    // NOTE / IDEA
    // if we use "refreshTokens" we can use the cache to store them
    // also we can use the cache as a blacklist of revoked "accessTokens" as well

    return accessToken;
  }
}
