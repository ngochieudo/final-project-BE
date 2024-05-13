import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostService {
    prismaService: any;
    getAllPost(userId: string) {
        const posts =  this.prismaService.post.findMany({
            where: {
                userId
            }
        })
        return posts
    }


    getPostById(postId: string) {
        const post = this.prismaService.post.findUnique({
            where: {
                id: postId
            }
        })
        return post
    }

    
    async createPost(createPostDto: CreatePostDto, userId: string) {
        const newPost = await this.prismaService.post.create({
            data: {
                ...createPostDto,
                userId
            }
        })
        return newPost
    }

   

    async updatePost(postId: string, updatePostDto: UpdatePostDto) {
        const post = this.prismaService.post.findUnique({
            where: {
                id: postId
            }
        })
        if(!post) {
            throw new ForbiddenException('Cannot find the post to update')
        }
        return this.prismaService.post.update({
            where: {
                id: postId
            },
            data: {...updatePostDto}
        })
    }

    async deletePost(postId: string) {
        const post = this.prismaService.post.findUnique({
            where: {
                id: postId
            }
        })
        if(!post) {
            throw new ForbiddenException('Cannot find the post to delete')
        }
        return this.prismaService.post.delete({
            where: {
                id: postId
            },
        })
    }
}
