import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CommandType, QueryType, Page as PageModel } from '../../../../../shared/dist/types';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10): Promise<PageModel[]> {
    return this.pagesService.findAll({ page, limit });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PageModel> {
    return this.pagesService.findOne(id);
  }

  @Post()
  async create(@Body() createPageDto: any): Promise<PageModel> {
    return this.pagesService.create(createPageDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePageDto: any): Promise<PageModel> {
    return this.pagesService.update(id, updatePageDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ id: string; deleted: boolean }> {
    return this.pagesService.remove(id);
  }
}