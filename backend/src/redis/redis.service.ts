import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private isConnected = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisHost = this.configService.get<string>('REDIS_HOST', 'localhost');
    const redisPort = this.configService.get<number>('REDIS_PORT', 6379);

    this.client = createClient({
      url: `redis://${redisHost}:${redisPort}`,
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.on('connect', () => {
      console.log('Connected to Redis');
      this.isConnected = true;
    });
    this.client.on('disconnect', () => {
      console.log('Disconnected from Redis');
      this.isConnected = false;
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.client.quit();
    }
  }

  getClient(): RedisClientType {
    return this.client;
  }

  // Cache operations
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, { EX: ttl });
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  // List operations for CQRS
  async pushToList(listKey: string, value: string): Promise<number> {
    return this.client.lPush(listKey, value);
  }

  async popFromList(listKey: string): Promise<string | null> {
    return this.client.rPop(listKey);
  }

  async blockingPopFromList(listKey: string, timeout: number): Promise<[string, string] | null> {
    const result = await this.client.brPop(listKey, timeout);
    return result ? [result.key, result.element] : null;
  }

  // Generate a unique response key
  generateResponseKey(commandId: string): string {
    return `response:${commandId}`;
  }
}