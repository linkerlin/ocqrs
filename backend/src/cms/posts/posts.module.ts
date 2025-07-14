import { Module } from '@nestjs/common';
import { CqrsModule } from '../../cqrs/cqrs.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [CqrsModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}