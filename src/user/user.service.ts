import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService ) {}

    async getUserDetail(id: string) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: {
                    id: id,
                },
            });
            return user;
        } catch (error) {
            throw new Error('Could not retrieve user details');
        }
    }

    async getAllUsers() {
        try {
            const user = await this.prismaService.user.findMany();
            return user;
        } catch (error) {
            throw new Error('Could not retrieve user details');
        }
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        // Hash the password if it exists in the updateUserDto
        if (updateUserDto.password) {
            updateUserDto.password = await argon.hash(updateUserDto.password);
        }

        try {
            const updatedUser = await this.prismaService.user.update({
                where: { id },
                data: updateUserDto,
            });
            return updatedUser;
        } catch (error) {
            throw new Error('Could not update user details');
        }
    }
    
    async deleteUser(id: string) {
        // Delete related reservations
        await this.prismaService.reservation.deleteMany({
          where: { userId: id },
        });
      
        // Delete related favorites
        await this.prismaService.favorite.deleteMany({
          where: { userId: id },
        });
        // Delete related review comments
        await this.prismaService.review.deleteMany({
            where: { userId: id },
        })
      
        return this.prismaService.user.delete({
          where: { id },
        });
      }
      
}
