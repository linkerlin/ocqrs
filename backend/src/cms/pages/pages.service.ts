import { Injectable } from '@nestjs/common';
import { CommandBusService } from '../../cqrs/commands/command-bus.service';
import { QueryBusService } from '../../cqrs/queries/query-bus.service';
import { CommandType, QueryType, Page } from '../../../../../shared/dist/types';

@Injectable()
export class PagesService {
  constructor(
    private readonly commandBus: CommandBusService,
    private readonly queryBus: QueryBusService,
  ) {}

  async findAll(params: { page: number; limit: number }): Promise<Page[]> {
    // Try to get from cache first
    const cachedPages = await this.queryBus.execute<Page[]>(
      QueryType.LIST_PAGES,
      params,
    );

    if (cachedPages) {
      return cachedPages;
    }

    // If not in cache, execute command to fetch and cache
    const pages = await this.commandBus.execute<Page[]>(
      CommandType.CREATE_PAGE, // Using CREATE_PAGE as a placeholder for LIST_PAGES command
      { action: 'list', ...params },
    );

    // Cache the result
    await this.queryBus.setCacheResult(QueryType.LIST_PAGES, params, pages, 300); // 5 minutes TTL

    return pages;
  }

  async findOne(id: string): Promise<Page> {
    // Try to get from cache first
    const cachedPage = await this.queryBus.execute<Page>(
      QueryType.GET_PAGE,
      { id },
    );

    if (cachedPage) {
      return cachedPage;
    }

    // If not in cache, execute command to fetch and cache
    const page = await this.commandBus.execute<Page>(
      CommandType.CREATE_PAGE, // Using CREATE_PAGE as a placeholder for GET_PAGE command
      { action: 'get', id },
    );

    // Cache the result
    await this.queryBus.setCacheResult(QueryType.GET_PAGE, { id }, page, 300); // 5 minutes TTL

    return page;
  }

  async create(createPageDto: any): Promise<Page> {
    const page = await this.commandBus.execute<Page>(
      CommandType.CREATE_PAGE,
      createPageDto,
    );

    // Invalidate list cache
    // In a real application, you would need to invalidate all paginated list caches

    return page;
  }

  async update(id: string, updatePageDto: any): Promise<Page> {
    const page = await this.commandBus.execute<Page>(
      CommandType.UPDATE_PAGE,
      { id, ...updatePageDto },
    );

    // Invalidate specific page cache
    await this.queryBus.setCacheResult(QueryType.GET_PAGE, { id }, page, 300);

    // Invalidate list cache
    // In a real application, you would need to invalidate all paginated list caches

    return page;
  }

  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    const result = await this.commandBus.execute<{ id: string; deleted: boolean }>(
      CommandType.DELETE_PAGE,
      { id },
    );

    // Invalidate specific page cache
    await this.queryBus.setCacheResult(QueryType.GET_PAGE, { id }, null, 1);

    // Invalidate list cache
    // In a real application, you would need to invalidate all paginated list caches

    return result;
  }
}