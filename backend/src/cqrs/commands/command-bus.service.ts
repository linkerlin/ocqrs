import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../../redis/redis.service';
import { Command, CommandResponse, CommandType } from 'shared';

@Injectable()
export class CommandBusService {
  private readonly COMMAND_QUEUE = 'command_queue';
  private readonly RESPONSE_TIMEOUT = 30; // seconds

  constructor(private readonly redisService: RedisService) {}

  async execute<T>(type: CommandType, data: any): Promise<T> {
    const commandId = uuidv4();
    const responseKey = this.redisService.generateResponseKey(commandId);
    
    const command: Command = {
      id: commandId,
      type,
      timestamp: Date.now(),
      responseKey,
      data,
    };

    // Push command to Redis list
    await this.redisService.pushToList(this.COMMAND_QUEUE, JSON.stringify(command));
    
    // Wait for response with timeout
    const response = await this.waitForResponse(responseKey);
    
    if (!response) {
      throw new Error('Command execution timed out');
    }

    const parsedResponse: CommandResponse = JSON.parse(response);
    
    if (!parsedResponse.success) {
      throw new Error(parsedResponse.error || 'Command execution failed');
    }

    return parsedResponse.data as T;
  }

  private async waitForResponse(responseKey: string): Promise<string | null> {
    const result = await this.redisService.blockingPopFromList(responseKey, this.RESPONSE_TIMEOUT);
    
    if (!result) {
      return null;
    }

    // Clean up the response key
    await this.redisService.del(responseKey);
    
    return result[1]; // brPop returns [key, value]
  }
}