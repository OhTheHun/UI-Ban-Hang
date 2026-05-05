export interface OrderSummary {
  invoiceId: string;
  code: string;
  totalAmount: number;
  status: string;
  createdTime: string;
}

export interface OrderItem {
  quantity: number;
  total: number;
  productName: string;
  price: number;
  discountPrice: number;
}

export interface OrderDetail {
  invoiceId: string;
  code: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  createdTime: string;
  items: OrderItem[];
}
