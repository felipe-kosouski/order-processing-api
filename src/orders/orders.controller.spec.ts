import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderDto } from './dto/order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            findOrders: jest.fn(),
            processFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all orders', async () => {
    const result: OrderDto[] = [
      {
        user_id: 1,
        name: 'Zarelli',
        orders: [
          {
            order_id: 123,
            total: '1024.48',
            date: '2021-12-01',
            products: [
              { product_id: 111, value: '512.24' },
              { product_id: 122, value: '512.24' },
            ],
          },
        ],
      },
    ];
    jest.spyOn(service, 'findOrders').mockResolvedValue(result);
    expect(await controller.findAll()).toBe(result);
  });

  it('should process uploaded file', async () => {
    const file = { buffer: Buffer.from('file content') } as Express.Multer.File;
    const result = {
      message: 'File processed successfully',
      data: { count: 0 },
    };
    jest.spyOn(service, 'processFile').mockResolvedValue({ count: 0 });

    expect(await controller.uploadFile(file)).toEqual(result);
  });

  it('should handle empty orders', async () => {
    const result: OrderDto[] = [];
    jest.spyOn(service, 'findOrders').mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
  });

  it('should handle file processing errors', async () => {
    const file = { buffer: Buffer.from('file content') } as Express.Multer.File;
    jest
      .spyOn(service, 'processFile')
      .mockRejectedValue(new Error('Processing error'));

    await expect(controller.uploadFile(file)).rejects.toThrow(
      'Processing error',
    );
  });
});
