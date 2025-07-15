import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AdCategory } from '../enum/ad-category.enum';
import mongoose, { Document } from 'mongoose';
import { User } from '../../users/entities/user.entity';

@Schema({ timestamps: true })
export class Ad extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  imageUrl: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, enum: Object.values(AdCategory) })
  category: AdCategory;

  @Prop({ required: true })
  city: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const AdSchema = SchemaFactory.createForClass(Ad);
