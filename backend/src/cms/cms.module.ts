import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { PagesModule } from './pages/pages.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PostsModule, PagesModule, UsersModule],
})
export class CmsModule {}