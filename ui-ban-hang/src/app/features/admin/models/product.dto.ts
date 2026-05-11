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
  image_Url: string;
  status: number;
  donViTinh?: { ten: string };
  category?: { tenDanhMuc: string };
}
