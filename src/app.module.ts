import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders/orders.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'order-upload-api',
      auth: {
        username: 'admin',
        password: 'admin',
      },
    }),
    OrdersModule,
  ],
  controllers: [],
  providers: [OrdersService],
})
export class AppModule {}
