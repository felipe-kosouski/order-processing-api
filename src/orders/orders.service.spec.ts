import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { FileProcessorService } from './file-processor/file-processor.service';
import { Order } from './schemas/orders.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('OrdersService', () => {
  let service: OrdersService;
  let fileProcessorService: FileProcessorService;
  let orderModel: Model<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        FileProcessorService,
        {
          provide: getModelToken(Order.name),
          useValue: {
            find: jest.fn(),
            exec: jest.fn(),
            insertMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    fileProcessorService =
      module.get<FileProcessorService>(FileProcessorService);
    orderModel = module.get<Model<Order>>(getModelToken(Order.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find and group orders by user', async () => {
    const orders = [
      {
        userId: 1,
        name: 'User1',
        orderId: 1,
        products: [{ productId: 1, value: 100 }],
        date: new Date(),
      },
      {
        userId: 1,
        name: 'User1',
        orderId: 2,
        products: [{ productId: 2, value: 200 }],
        date: new Date(),
      },
      {
        userId: 2,
        name: 'User2',
        orderId: 3,
        products: [{ productId: 3, value: 300 }],
        date: new Date(),
      },
    ];
    jest.spyOn(orderModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue(orders),
    } as any);

    const result = await service.findOrders();

    expect(result).toEqual([
      {
        user_id: 1,
        name: 'User1',
        orders: [
          {
            order_id: 1,
            total: '100.00',
            date: expect.any(String),
            products: [{ product_id: 1, value: '100.00' }],
          },
          {
            order_id: 2,
            total: '200.00',
            date: expect.any(String),
            products: [{ product_id: 2, value: '200.00' }],
          },
        ],
      },
      {
        user_id: 2,
        name: 'User2',
        orders: [
          {
            order_id: 3,
            total: '300.00',
            date: expect.any(String),
            products: [{ product_id: 3, value: '300.00' }],
          },
        ],
      },
    ]);
  });

  it('should process file and return result', async () => {
    const file = { buffer: Buffer.from('file content') } as Express.Multer.File;
    const processFileSpy = jest
      .spyOn(fileProcessorService, 'processFile')
      .mockResolvedValue({ count: 3 });

    const result = await service.processFile(file);

    expect(processFileSpy).toHaveBeenCalledWith(file);
    expect(result).toEqual({ count: 3 });
  });

  it('should handle empty orders list', async () => {
    jest.spyOn(orderModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue([]),
    } as any);

    const result = await service.findOrders();

    expect(result).toEqual([]);
  });
});
