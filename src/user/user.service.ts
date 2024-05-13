import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor() {
        prismaService: PrismaService 
    }

    async getUserDetail() {
        
    }
}
