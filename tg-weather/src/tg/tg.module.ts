import { Module } from '@nestjs/common';
import { TgService } from './tg.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TgService]
})
export class TgModule {}
