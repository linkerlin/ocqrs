import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { Query, QueryType, QueryResponse } from 'shared';

@Injectable()
export class QueryBusService {
  constructor(private readonly redisService: RedisService) {}

  async execute<T>(type: QueryType, params: any): Promise<T> {
    // Generate cache key based on query type and parameters
    const cacheKey = this.generateCacheKey(type, params);
    
    // Try to get from cache first
    const cachedResult = await this.redisService.get(cacheKey);
    
    if (cachedResult) {
      const parsedResult: QueryResponse<T> = JSON.parse(cachedResult);
      return parsedResult.data as T;
    }
    
    // If not in cache, return null to indicate cache miss
    return null as unknown as T;
  }

  async setCacheResult<T>(type: QueryType, params: any, data: T, ttl?: number): Promise<void> {
    const cacheKey = this.generateCacheKey(type, params);
    
    const response: QueryResponse<T> = {
      success: true,
      data,
    };
    
    await this.redisService.set(cacheKey, JSON.stringify(response), ttl);
  }

  private generateCacheKey(type: QueryType, params: any): string {
    // Create a deterministic cache key based on query type and parameters
    return `query:${type}:${JSON.stringify(params)}`;
  }
}