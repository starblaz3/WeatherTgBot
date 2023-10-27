import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TgModule } from './tg/tg.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './Schemas/Admin';
import { Blacklist, BlacklistSchema } from './Schemas/Blacklist';

@Module({
  imports: [TgModule, ScheduleModule.forRoot(),HttpModule,ConfigModule.forRoot({isGlobal:true,envFilePath:".env"}),MongooseModule.forRoot(process.env.MONGO_URI),MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: Blacklist.name, schema: BlacklistSchema }])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
