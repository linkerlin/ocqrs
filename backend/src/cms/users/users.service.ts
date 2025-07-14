import { Injectable } from '@nestjs/common';
import { CommandBusService } from '../../cqrs/commands/command-bus.service';
import { QueryBusService } from '../../cqrs/queries/query-bus.service';
import { CommandType, QueryType, User } from '../../../../../shared/dist/types';

@Injectable()
export class UsersService {
  constructor(
    private readonly commandBus: CommandBusService,
    private readonly queryBus: QueryBusService,
  ) {}

  async findAll(params: { page: number; limit: number }): Promise<User[]> {
    // Try to get from cache first
    const cachedUsers = await this.queryBus.execute<User[]>(
      QueryType.LIST_USERS,
      params,
    );

    if (cachedUsers) {
      return cachedUsers;
    }

    // If not in cache, execute command to fetch and cache
    const users = await this.commandBus.execute<User[]>(
      CommandType.CREATE_USER, // Using CREATE_USER as a placeholder for LIST_USERS command
      { action: 'list', ...params },
    );

    // Cache the result
    await this.queryBus.setCacheResult(QueryType.LIST_USERS, params, users, 300); // 5 minutes TTL

    return users;
  }

  async findOne(id: string): Promise<User> {
    // Try to get from cache first
    const cachedUser = await this.queryBus.execute<User>(
      QueryType.GET_USER,
      { id },
    );

    if (cachedUser) {
      return cachedUser;
    }

    // If not in cache, execute command to fetch and cache
    const user = await this.commandBus.execute<User>(
      CommandType.CREATE_USER, // Using CREATE_USER as a placeholder for GET_USER command
      { action: 'get', id },
    );

    // Cache the result
    await this.queryBus.setCacheResult(QueryType.GET_USER, { id }, user, 300); // 5 minutes TTL

    return user;
  }

  async create(createUserDto: any): Promise<User> {
    const user = await this.commandBus.execute<User>(
      CommandType.CREATE_USER,
      createUserDto,
    );

    // Invalidate list cache
    // In a real application, you would need to invalidate all paginated list caches

    return user;
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    const user = await this.commandBus.execute<User>(
      CommandType.UPDATE_USER,
      { id, ...updateUserDto },
    );

    // Invalidate specific user cache
    await this.queryBus.setCacheResult(QueryType.GET_USER, { id }, user, 300);

    // Invalidate list cache
    // In a real application, you would need to invalidate all paginated list caches

    return user;
  }

  async remove(id: string): Promise<{ id: string; deleted: boolean }> {
    const result = await this.commandBus.execute<{ id: string; deleted: boolean }>(
      CommandType.DELETE_USER,
      { id },
    );

    // Invalidate specific user cache
    await this.queryBus.setCacheResult(QueryType.GET_USER, { id }, null, 1);

    // Invalidate list cache
    // In a real application, you would need to invalidate all paginated list caches

    return result;
  }
}