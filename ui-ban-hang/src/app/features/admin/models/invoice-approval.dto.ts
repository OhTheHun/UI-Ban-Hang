export interface InvoiceApprovalDTO {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  address: string;
  totalAmount: number;
  status: number; // InvoiceEnum
  createdAt: string;
  processedAt?: string;
  rejectReason?: string;
  items: {
    productName: string;
    price: number;
    discountPrice?: number;
    quantity: number;
  }[];
}
