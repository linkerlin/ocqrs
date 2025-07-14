import { Module } from '@nestjs/common';
import { CqrsModule } from '../../cqrs/cqrs.module';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';

@Module({
  imports: [CqrsModule],
  controllers: [PagesController],
  providers: [PagesService],
})
export class PagesModule {}