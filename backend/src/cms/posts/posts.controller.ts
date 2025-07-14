import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CommandType, QueryType, Post as PostModel } from 'shared';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10): Promise<PostModel[]> {
    return this.postsService.findAll({ page, limit });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostModel> {
    return this.postsService.findOne(id);
  }

  @Post()
  async create(@Body() createPostDto: any): Promise<PostModel> {
    return this.postsService.create(createPostDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: any): Promise<PostModel> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ id: string; deleted: boolean }> {
    return this.postsService.remove(id);
  }
}