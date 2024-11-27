import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../schemas/orders.schema';

@Injectable()
export class FileProcessorService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async processFile(file: Express.Multer.File) {
    const content = this.getFileContent(file);
    const lines = this.splitContentIntoLines(content);
    const orders = this.parseOrders(lines);
    await this.saveOrders(orders);
    return this.createResult(orders);
  }

  private getFileContent(file: Express.Multer.File): string {
    return file.buffer.toString('utf8');
  }

  private splitContentIntoLines(content: string): string[] {
    return content.split('\n');
  }

  private async saveOrders(orders: Partial<Order>[]): Promise<void> {
    await this.orderModel.insertMany(orders);
  }

  private createResult(orders: Partial<Order>[]): { count: number } {
    return { count: orders.length };
  }

  private parseOrders(lines: string[]): Partial<Order>[] {
    const ordersMap: Record<number, Partial<Order>> = {};

    lines
      .filter((line) => line.trim() !== '')
      .forEach((line) => {
        const { userId, name, orderId, productId, value, date } =
          this.parseLine(line);

        if (!ordersMap[orderId]) {
          ordersMap[orderId] = {
            userId,
            name,
            orderId,
            products: [],
            date,
          };
        }

        this.addProductToOrder(ordersMap[orderId], productId, value);
      });

    return Object.values(ordersMap);
  }

  private addProductToOrder(
    order: Partial<Order>,
    productId: number,
    value: number,
  ) {
    order.products.push({ productId, value });
  }

  private parseLine(line: string) {
    const dateStr = line.slice(87, 95).trim();
    const year = parseInt(dateStr.slice(0, 4), 10);
    const month = parseInt(dateStr.slice(4, 6), 10) - 1;
    const day = parseInt(dateStr.slice(6, 8), 10);

    const userId = parseInt(line.slice(0, 10).trim());
    const name = line.slice(11, 55).trim();
    const orderId = parseInt(line.slice(56, 65).trim());
    const productId = parseInt(line.slice(66, 75).trim());
    const value = parseFloat(line.slice(75, 87).trim());
    const date = new Date(year, month, day);

    return { userId, name, orderId, productId, value, date };
  }
}
