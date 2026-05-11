export interface InvoiceDTO {
  id: string;
  customerId?: string;
  fullName: string;
  phone: string;
  address: string;
  code: string;
  paymentMethod: string;
  totalAmount: number;
  status: number; // InvoiceEnum
  createdAt: string;
}
