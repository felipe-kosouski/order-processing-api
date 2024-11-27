import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Order extends Document {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  orderId: number;

  @Prop({ required: true })
  products: {
    productId: number;
    value: number;
  }[];

  @Prop({ required: true })
  date: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
