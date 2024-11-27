import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrderDto } from './dto/order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAll(): Promise<OrderDto[]> {
    return this.ordersService.findOrders();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.ordersService.processFile(file);
    return { message: 'File processed successfully', data: result };
  }
}
