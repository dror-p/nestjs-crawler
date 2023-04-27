import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlerController } from './controllers/crawler/crawler.controller';

@Module({
  imports: [],
  controllers: [AppController, CrawlerController],
  providers: [AppService],
})
export class AppModule {}
