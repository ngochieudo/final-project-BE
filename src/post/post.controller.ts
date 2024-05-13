import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto';

@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}
    @Get()
    getAllPosts(userId: string) {
        this.postService.getAllPost(userId)
    }
    @Get(':id')
    ViewPostDetail(@Param('id') postId: string) {
        this.postService.getPostById(postId)
    }
    @Post()
    createNewPost( userId: string, @Body() createPostDto: CreatePostDto) {
        this.postService.createPost(createPostDto, userId)
        console.log('Add successful')
        console.log(`PostId: ${JSON.stringify(createPostDto)}`)
    }
    @Patch(':id')
    updatePostById(@Param('id', ) PostId: string, @Body() updatePostDto: UpdatePostDto) {
        this.postService.updatePost(PostId, updatePostDto)
    }
    @Delete(':id')
    deletePost(@Param('id') PostId: string) {
        this.postService.deletePost(PostId)
    }
}
