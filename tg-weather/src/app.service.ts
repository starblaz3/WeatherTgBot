import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './Schemas/Admin';
import { Blacklist, BlacklistDocument } from './Schemas/Blacklist';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Blacklist.name)
    private BlacklistModel: Model<BlacklistDocument>,
  ) {}

  async login({ email, name }: { email: string; name: string }): Promise<any> {
    try {
      const userExists = await this.UserModel.findOne({ email: email }).exec();
      console.log(userExists);
      if (!userExists) {
        return { message: 'Invalid User' };
      } else {
        console.log('user exists');
        let res = { email: userExists['_doc'].email, name: name };
        console.log(res);
        return { message: 'success', data: res };
      }
    } catch (err) {
      console.log(err);
    }
  }
  async addAdmin({ email }: { email: string }): Promise<any> {
    try {
      const userExists = await this.UserModel.findOne({ email: email }).exec();
      if (userExists) {
        return { message: 'User already exists' };
      } else {
        await this.UserModel.create({ email: email });
        return { message: 'success' };
      }
    } catch (err) {
      console.log(err);
      return { message: 'Failed to add Admin', error: err };
    }
  }
  async Blacklist({ tgId }: { tgId: string }): Promise<any> {
    try {
      const userExists = await this.BlacklistModel.findOne({
        tgId: tgId,
      }).exec();
      if (userExists == null) {
        await this.BlacklistModel.create({ tgId: tgId });
        return { message: 'success' };
      }
      return { message: 'User already blacklisted' };
    } catch (err) {
      console.log(err);
      return { message: 'Failed to blacklist User', error: err };
    }
  }
  async Whitelist({ tgId }: { tgId: string }): Promise<any> {
    try {
      const userExists = await this.BlacklistModel.findOne({
        tgId: tgId,
      }).exec();
      if (userExists != null) {
        await this.BlacklistModel.deleteOne({ tgId: tgId });
        return { message: 'success' };
      }
      return { message: 'User already whitelisted' };
    } catch (err) {
      console.log(err);
      return { message: 'Failed to blacklist User', error: err };
    }
  }
}
