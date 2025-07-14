import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CommandType, QueryType, User as UserModel } from '../../../../../shared/dist/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10): Promise<UserModel[]> {
    return this.usersService.findAll({ page, limit });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserModel> {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: any): Promise<UserModel> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: any): Promise<UserModel> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ id: string; deleted: boolean }> {
    return this.usersService.remove(id);
  }
}