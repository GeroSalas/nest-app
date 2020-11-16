import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import UserEntity from 'src/modules/users/interfaces/user';
import UsersRepository from 'src/modules/users/users.repository';
import { SignUpDTO } from 'src/modules/auth/dto/req';
import { UpdateUserDTO } from 'src/modules/users/dto/req';
import { ProfileUserDTO } from './dto/res';

@Injectable()
export default class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {
    this.logger.debug({ usersRepository }, 'injected UsersRepository');
  }

  async create(data: SignUpDTO): Promise<string> {
    const userId = await this.usersRepository.save(data);
    return userId;
  }

  async getByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOneByUsername(username);
    return user;
  }

  async getById(id: string): Promise<UserEntity | null> {
    const user = await this.usersRepository.findOneByID(id);
    return user;
  }

  async getFullProfileByID(id: string): Promise<ProfileUserDTO> {
    // I decided to put everything inside the SQL repository
    // but this could be addressed easier with some ORM
    const userProfile = await this.usersRepository.findFullProfileByUserID(id);
    return userProfile;
  }

  async getAll(): Promise<ProfileUserDTO[]> {
    const userProfile = await this.usersRepository.findAllUsers();
    return userProfile;
  }

  async update(userId: string, data: UpdateUserDTO): Promise<boolean> {
    const user = await this.usersRepository.findOneByID(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.update(userId, data);
    return true;
  }
}
