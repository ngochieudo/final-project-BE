import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtGuard } from './guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {

    }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
    
    @Post('login') 
    login(@Body() authDto:AuthDto) {
        return this.authService.login(authDto);
    }

}
