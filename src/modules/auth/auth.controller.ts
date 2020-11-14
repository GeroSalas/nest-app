import { Body, Controller, HttpCode, Get, Put, Post, UseGuards, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import AuthService from './auth.service';
import LocalAuthGuard from './guards/local-auth.guard';
import AuthUser from 'src/decorators/auth-user.decorator';
import AuthContext from './interfaces/authContext';
import { SignInDTO, SignUpDTO } from './dto/req';
import { AccessTokenDTO, CreatedUserDTO } from './dto/res';
import JwtAuthGuard from './guards/jwt-auth.guard';
import { ProfileUserDTO } from '../users/dto/res';
import { UpdateUserDTO } from '../users/dto/req';

@ApiTags('Auth & Profile')
@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: SignUpDTO })
  @ApiOkResponse({
    type: CreatedUserDTO,
    description: '201 Successfully created',
  })
  @ApiBadRequestResponse({ description: '400 ValidationException' })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signUp(@Body() reqInput: SignUpDTO): Promise<CreatedUserDTO> {
    const id = await this.authService.registerUser(reqInput);
    const response: CreatedUserDTO = { id };
    return response;
  }

  @ApiBody({ type: SignInDTO })
  @ApiOkResponse({
    type: AccessTokenDTO,
    description: '200 Returns JWT access token',
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@AuthUser() authUser: AuthContext): Promise<AccessTokenDTO> {
    const accessToken = await this.authService.createToken(authUser);
    const response: AccessTokenDTO = { accessToken };
    return response;
  }

  @ApiOkResponse({
    type: ProfileUserDTO,
    description: '200 Success. Return corresponding user profile given a valid JWT.',
  })
  @ApiUnauthorizedResponse({ description: '401 UnauthorizedException' })
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@AuthUser() authUser: AuthContext): Promise<ProfileUserDTO> {
    const userProfile = await this.authService.getUserProfile(authUser.userId);
    return userProfile;
  }

  @ApiOkResponse({
    type: ProfileUserDTO,
    description: '200 Success. Updates and returns profile again',
  })
  @ApiUnauthorizedResponse({ description: '401 UnauthorizedException' })
  @ApiBearerAuth()
  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateUserProfile(
    @AuthUser('userId') userId: string,
    @Body() reqInput: UpdateUserDTO,
  ): Promise<ProfileUserDTO> {
    const updatedProfile = await this.authService.updateUserProfile(userId, reqInput);
    return updatedProfile;
  }
}
