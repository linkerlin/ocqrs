import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { Command, CommandType, CommandResponse } from 'shared';

@Injectable()
export class CommandJobService implements OnModuleInit {
  private readonly COMMAND_QUEUE = 'command_queue';
  private readonly COMMAND_TIMEOUT = 0; // 0 means block indefinitely
  private isRunning = false;

  constructor(private readonly redisService: RedisService) {}

  async onModuleInit() {
    // Start processing commands
    this.startProcessing();
  }

  private async startProcessing() {
    this.isRunning = true;
    console.log('Command job service started');
    
    // Process commands in a loop
    while (this.isRunning) {
      try {
        const result = await this.redisService.blockingPopFromList(this.COMMAND_QUEUE, this.COMMAND_TIMEOUT);
        
        if (result) {
          const commandStr = result[1]; // brPop returns [key, value]
          const command: Command = JSON.parse(commandStr);
          
          // Process the command
          await this.processCommand(command);
        }
      } catch (error) {
        console.error('Error processing command:', error);
        // Continue processing even if there's an error
      }
    }
  }

  private async processCommand(command: Command) {
    console.log(`Processing command: ${command.type} (${command.id})`);
    
    try {
      // Execute the command based on its type
      const result = await this.executeCommand(command);
      
      // Send success response
      const response: CommandResponse = {
        success: true,
        data: result,
      };
      
      await this.sendResponse(command.responseKey, response);
    } catch (error) {
      console.error(`Error executing command ${command.type}:`, error);
      
      // Send error response
      const response: CommandResponse = {
        success: false,
        error: error.message || 'Command execution failed',
      };
      
      await this.sendResponse(command.responseKey, response);
    }
  }

  private async executeCommand(command: Command): Promise<any> {
    // Implement command handling logic based on command type
    switch (command.type) {
      case CommandType.CREATE_POST:
        return this.createPost(command.data);
      case CommandType.UPDATE_POST:
        return this.updatePost(command.data);
      case CommandType.DELETE_POST:
        return this.deletePost(command.data);
      case CommandType.CREATE_PAGE:
        return this.createPage(command.data);
      case CommandType.UPDATE_PAGE:
        return this.updatePage(command.data);
      case CommandType.DELETE_PAGE:
        return this.deletePage(command.data);
      case CommandType.CREATE_USER:
        return this.createUser(command.data);
      case CommandType.UPDATE_USER:
        return this.updateUser(command.data);
      case CommandType.DELETE_USER:
        return this.deleteUser(command.data);
      default:
        throw new Error(`Unsupported command type: ${command.type}`);
    }
  }

  private async sendResponse(responseKey: string, response: CommandResponse): Promise<void> {
    await this.redisService.pushToList(responseKey, JSON.stringify(response));
  }

  // Command handlers
  private async createPost(data: any) {
    // Simulate database operation
    const post = {
      id: `post-${Date.now()}`,
      title: data.title,
      content: data.content,
      author: data.author,
      status: data.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: data.tags || [],
    };
    
    // In a real application, save to database here
    console.log('Created post:', post);
    
    return post;
  }

  private async updatePost(data: any) {
    // Simulate database operation
    const post = {
      id: data.id,
      title: data.title,
      content: data.content,
      author: data.author,
      status: data.status,
      updatedAt: new Date().toISOString(),
      tags: data.tags,
    };
    
    // In a real application, update in database here
    console.log('Updated post:', post);
    
    return post;
  }

  private async deletePost(data: any) {
    // Simulate database operation
    console.log('Deleted post:', data.id);
    
    return { id: data.id, deleted: true };
  }

  private async createPage(data: any) {
    // Simulate database operation
    const page = {
      id: `page-${Date.now()}`,
      title: data.title,
      content: data.content,
      slug: data.slug,
      status: data.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // In a real application, save to database here
    console.log('Created page:', page);
    
    return page;
  }

  private async updatePage(data: any) {
    // Simulate database operation
    const page = {
      id: data.id,
      title: data.title,
      content: data.content,
      slug: data.slug,
      status: data.status,
      updatedAt: new Date().toISOString(),
    };
    
    // In a real application, update in database here
    console.log('Updated page:', page);
    
    return page;
  }

  private async deletePage(data: any) {
    // Simulate database operation
    console.log('Deleted page:', data.id);
    
    return { id: data.id, deleted: true };
  }

  private async createUser(data: any) {
    // Simulate database operation
    const user = {
      id: `user-${Date.now()}`,
      username: data.username,
      email: data.email,
      role: data.role || 'subscriber',
      createdAt: new Date().toISOString(),
    };
    
    // In a real application, save to database here
    console.log('Created user:', user);
    
    return user;
  }

  private async updateUser(data: any) {
    // Simulate database operation
    const user = {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
    };
    
    // In a real application, update in database here
    console.log('Updated user:', user);
    
    return user;
  }

  private async deleteUser(data: any) {
    // Simulate database operation
    console.log('Deleted user:', data.id);
    
    return { id: data.id, deleted: true };
  }
}