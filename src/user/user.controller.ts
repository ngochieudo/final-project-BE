import { Body, Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/user.decorator';
import { Prisma, User } from '@prisma/client';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('users')
@UseGuards(RolesGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    getProfile(@GetUser() user: User) {
    return user;
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Get(':id')
  async GetUser(
    @Param('id') id: string,
  ) {
    return this.userService.getUserDetail(id);
  }

  @Delete(':id')
  async DeleteUserById(
    @Param('id') id: string,
  ) {
    return this.userService.deleteUser(id);
  }

}
