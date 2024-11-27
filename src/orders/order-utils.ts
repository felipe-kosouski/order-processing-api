import { Order } from './schemas/orders.schema';

export function groupOrdersByUser(orders: Order[]): Record<number, any> {
  return orders.reduce((acc, order) => {
    const formattedOrder = formatOrder(order);
    if (!acc[order.userId]) {
      acc[order.userId] = {
        user_id: order.userId,
        name: order.name,
        orders: [],
      };
    }
    acc[order.userId].orders.push(formattedOrder);
    return acc;
  }, {});
}

export function formatOrder(order: Order): {
  order_id: number;
  total: string;
  date: string;
  products: { product_id: number; value: string }[];
} {
  const total = calculateTotal(order.products);
  return {
    order_id: order.orderId,
    total,
    date: order.date.toISOString().split('T')[0],
    products: formatProducts(order.products),
  };
}

export function calculateTotal(products: { value: number }[]): string {
  return products.reduce((acc, product) => acc + product.value, 0).toFixed(2);
}

export function formatProducts(
  products: { productId: number; value: number }[],
): { product_id: number; value: string }[] {
  return products.map((product) => ({
    product_id: product.productId,
    value: product.value.toFixed(2),
  }));
}
