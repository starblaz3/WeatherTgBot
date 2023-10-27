import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { OAuth2Client } from 'google-auth-library';
import * as fs from 'fs';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/login')
  async login(@Body('token') token): Promise<any> {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const data = await this.appService.login({
        email: ticket.getPayload().email,
        name: ticket.getPayload().name,
      });      
      return data;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  @Post('/api')
  async addApi(@Body('apiKey') apiKey: string): Promise<any> {
    try {
      fs.readFile(process.cwd() + '/.env', (err, data) => {
        if (err) {
          console.error(err);
          return { message: 'Failed to post API Key', error: err };
        }
        return { message: 'Success' };
      });
    } catch (err) {
      console.log(err);
      return { message: 'Failed to post API Key', error: err };
    }
  }

  @Post('/addAdmin')
  async addAdmin(@Body('email') email: string): Promise<any> {
    try {
      const res=await this.appService.addAdmin({ email: email });
      return res;
    } catch (err) {
      console.log(err);
      return { message: 'Failed to add Admin', error: err };
    }
  }

  @Post('/blacklist')
  async Blacklist(@Body('tgId') tgId: string): Promise<any> {
    try{
      const res=await this.appService.Blacklist({ tgId: tgId });
      return res;
    }catch(err){
      console.log(err);
      return { message: 'Failed to blacklist User', error: err };
    }
  }

  @Post('/whitelist')
  async Whitelist(@Body('tgId') tgId: string): Promise<any> {
    try{
      const res=await this.appService.Whitelist({ tgId: tgId });
      return res;
    }catch(err){
      console.log(err);
      return { message: 'Failed to blacklist User', error: err };
    }
  }
}
