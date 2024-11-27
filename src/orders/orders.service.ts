import { Injectable } from '@nestjs/common';
import { Order } from './schemas/orders.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDto } from './dto/order.dto';
import { FileProcessorService } from './file-processor/file-processor.service';
import { groupOrdersByUser } from './order-utils';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly fileProcessorService: FileProcessorService,
  ) {}

  async findOrders(): Promise<OrderDto[]> {
    const orders = await this.orderModel.find().exec();
    const groupedOrders = groupOrdersByUser(orders);
    return Object.values(groupedOrders);
  }

  async processFile(file: Express.Multer.File) {
    return this.fileProcessorService.processFile(file);
  }
}
