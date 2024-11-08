import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { RegisterDto } from './dto/register.dto';
import * as argon from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {

    }
    async register(registerDto: RegisterDto) {

        const user = await this.prismaService.user.findUnique({
            where: {
                email: registerDto.email
            }
        });

        if(user) throw new ConflictException('User already exist');

        const createUser = await this.prismaService.user.create({
            data: {
                ...registerDto,
                password: await argon.hash(registerDto.password)
            },
        });

        const { password, ...result} = createUser;
        return result;
    }
    async login(authDto: AuthDto) {
        const user = await this.validateUser(authDto);
        
        const payload = {
            sub: user.id
        };

        const jwtString = await  this.jwtService.signAsync(payload, {
            expiresIn: '3h',
            secret: this.configService.get('JWT_SECRET')
        })
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
            secret: this.configService.get('JWT_REFRESH_SECRET')
        });

        return {
            user, 
            backendTokens: {
                accessToken: jwtString,
                refreshToken: refreshToken
            }
        }
    }

    async validateUser(authDto: AuthDto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: authDto.email
            }
        })
        if (user && (await argon.verify(user.password,authDto.password))) {
            const { password, ...result} = user;
            return result;
        }
        throw new UnauthorizedException();
    }
}
