import { Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { CommandBusService } from './commands/command-bus.service';
import { QueryBusService } from './queries/query-bus.service';
import { CommandJobService } from './jobs/command-job.service';

@Module({
  imports: [RedisModule],
  providers: [CommandBusService, QueryBusService, CommandJobService],
  exports: [CommandBusService, QueryBusService],
})
export class CqrsModule {}