import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlacklistDocument = HydratedDocument<Blacklist>;
 
@Schema()
export class Blacklist {
  @Prop()
  tgId: string;
}

export const BlacklistSchema = SchemaFactory.createForClass(Blacklist);