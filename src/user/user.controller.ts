import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {

    }
    @UseGuards(JwtGuard)
    @Get(':id')
    async getUserDetail(){
        return await this.userService.getUserDetail()
    }
}
