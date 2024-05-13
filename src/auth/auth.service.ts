import { ForbiddenException, Injectable } from '@nestjs/common';
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

        const hashedPassword = await argon.hash(registerDto.password)
        try{
            const user = await this.prismaService.user.create({
                data: {
                    email: registerDto.email,
                    password: hashedPassword,
                    name: registerDto.name,
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true
                }
            })
            return await this.signJwtToken(user.id, user.email)
        }
        catch(error) {
            if(error.code == 'P2002') {
                // throw new ForbiddenException(error.message)
                throw new ForbiddenException('Email already exist!!')
            }
            return {
                error
            }
        }
    }
    async login(authDto: AuthDto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: authDto.email
            }
        })
        if(!user) {
            throw new ForbiddenException('User does not exist! Please check if the email is wrong')
        }
        const password = await argon.verify(
            user.password,
            authDto.password
        )
        if(!password) {
            throw new ForbiddenException('Incorrect password!!')
        }
        delete user.password
        return await this.signJwtToken(user.id, user.email)
    }

    async signJwtToken(userId: string, email: string):Promise<{accessToken: string}>{
        const payload = {
            sub: userId,
            email,
        }
        const jwtString = await  this.jwtService.signAsync(payload, {
            expiresIn: '20m',
            secret: this.configService.get('JWT_SECRET')
        })
        return {
            accessToken: jwtString,
        }
    }
}
