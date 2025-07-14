import { Module } from '@nestjs/common';
import { CqrsModule } from '../../cqrs/cqrs.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}