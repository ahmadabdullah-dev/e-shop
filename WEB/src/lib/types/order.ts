export type ProductOrderItemDto = {
  productId: string;
  quantity: number;
};
export type CreateOrderDto = {
  shippingAddress: string;
  products: ProductOrderItemDto[];
};
export type OrderDto = {
  id: string;
  userId: string;
  shippingAddress: string;
  products: ProductOrderItemDto[];
  totalPrice: string;
  orderStatus: string;
  createdAt: string;
};
