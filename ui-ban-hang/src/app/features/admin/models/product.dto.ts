export interface ProductDTO {
  id: string;
  categoryId: string;
  supplierId: string;
  donViTinhId: string;
  productName: string;
  price: number;
  discountPrice: number;
  cost: number;
  sku: string;
  description?: string;
  imageUrl: string;
  status: number;
  donViTinh?: { ten: string };
  category?: { tenDanhMuc: string };
}

export interface ProductCreateRequest {
  categoryId: string;
  supplierId: string;
  donViTinhId: string;
  productName: string;
  price: number;
  discountPrice: number;
  cost: number;
  sku: string;
  description?: string;
  imageUrl?: string;
  imageFile?: File | null;
  status: number;
}

export interface ProductUpdateRequest extends ProductCreateRequest {
  id: string;
}
