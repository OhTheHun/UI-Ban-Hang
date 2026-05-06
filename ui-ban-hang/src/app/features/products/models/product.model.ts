export interface Unit {
  ten: string;
}

export interface Product {
  id: string;
  productName: string;
  price: number;
  discountPrice: number;
  image_Url: string;
  categoryId?: string;
  donViTinh?: Unit;
}

export interface Category {
  id: string;
  tenDanhMuc: string;
  description: string;
  parentId: string | null;
}
