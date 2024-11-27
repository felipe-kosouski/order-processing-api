export class OrderDto {
  user_id: number;
  name: string;
  orders: {
    order_id: number;
    total: string;
    date: string;
    products: {
      product_id: number;
      value: string;
    }[];
  }[];
}
