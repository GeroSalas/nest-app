import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import UsersService from './users.service';
import { ProfileUserDTO } from './dto/res';

// I ADDED THIS JUST FOR QUICK & VISUAL TESTING PURPOSES AND INSPECT THE DB WITHOUT A VALID JWT
// THIS CONTROLLER COULD BE USED FOR "ADMIN" PURPOSES TO MANAGE (CRUD) USERS OF THE APP
@ApiTags('Users')
@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    type: [ProfileUserDTO],
    description: '200 OK Return all users (FOR QUICK TESTING)',
  })
  @Get()
  async getAllUsers(): Promise<ProfileUserDTO[]> {
    const users = await this.usersService.getAll();
    return users;
  }
}
