import { Injectable } from '@nestjs/common';
import { CommandBusService } from '../../cqrs/commands/command-bus.service';
import { QueryBusService } from '../../cqrs/queries/query-bus.service';
import { CommandType, QueryType, Post } from 'shared';

@Injectable()
export class PostsService {
  constructor(
    private readonly commandBus: CommandBusService,
    private readonly queryBus: QueryBusService,
  ) {}

  async findAll(params: { page: number; limit: number }): Promise<Post[]> {
    // Try to get from cache first
    const cachedPosts = await this.queryBus.execute<Post[]>(
      QueryType.LIST_POSTS,
      params,
    );

    if (cachedPosts) {
      return cachedPosts;
    }

    // If not in cache, execute command to fetch and cache
    const posts = await this.commandBus.execute<Post[]>(
      CommandType.CREATE_POST, // Using CREATE_POST as a placeholder for LIST_POSTS command
      { action: 'list', ...params },
    );

    // Cache the result
    await this.queryBus.setCacheResult(QueryType.LIST_POSTS, params, posts, 300); // 5 minutes TTL

    return posts;
  }

  async findOne(id: string): Promise<Post> {
    // Try to get from cache first
    const cachedPost = await this.queryBus.execute<Post>(
      QueryType.GET_POST,
      { id },
    );

    if (cachedPost) {
      return cachedPost;
    }

    // If not in cache, execute command to fetch and cache
    const post = await this.commandBus.execute<Post>(
      CommandType.CREATE_POST, // Using CREATE_POST as a placeholder for GET_POST command
      { action: 'get', id },
    );

    // Cache the result
    await this.queryBus.setCacheResult(QueryType.GET_POST, { id }, post, 300); // 5 minutes TTL

    return post;
  }

  async create(createPostDto: any): Promise<Post> {
    const post = await this.commandBus.execute<Post>(
      CommandType.CREATE_POST,
      createPostDto,
    );

    // Invalidate list cache
    // In a real application, you would need to invalidate all paginated list caches

    return post;
  }

  async update(id: string, updatePostDto: any): Promise<Post> {
    const post = await this.commandBus.execute<Post>(
      CommandType.UPDATE_POST,
      { id, ...updatePostDto },
    );

    // Invalidate specific post cache
    await this.queryBus.setCacheResult(QueryType.GET_POST, { id }, post, 300);

    // Invalidate list cache
    // In a real application, you would need to invalidate all paginated list caches

    return post;
  }

  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    const result = await this.commandBus.execute<{ id: string; deleted: boolean }>(
      CommandType.DELETE_POST,
      { id },
    );

    // Invalidate specific post cache
    await this.queryBus.setCacheResult(QueryType.GET_POST, { id }, null, 1);

    // Invalidate list cache
    // In a real application, you would need to invalidate all paginated list caches

    return result;
  }
}