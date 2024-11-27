import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { MongooseModule } from '@nestjs/mongoose';

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
  providers: [],
})
export class AppModule {}
