export interface ImportDetail {
  productId: string;
  productName?: string;
  quantity: number;
  importPrice: number;
  totalPrice?: number;
}

export interface Import {
  id?: string;
  importId?: string;
  code?: string;
  totalAmount?: number;
  status?: string;
  note: string;
  createdTime?: string;
  createdBy?: string;
  details: ImportDetail[];
}

export interface ImportFilterParams {
  fromDate?: string;
  toDate?: string;
  productName?: string;
  status?: 'Pending' | 'Success';
}
