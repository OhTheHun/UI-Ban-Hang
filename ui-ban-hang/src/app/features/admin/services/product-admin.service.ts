import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ConfigService } from '../../../core/services/config.service';

export interface ProductAdmin {
  id: string;
  imageUrl: string;
  productName: string;
  sku: string;
  categoryId: string;
  supplierName: string;
  supplierId: string;
  unitName: string;
  donViTinhId: string;
  price: number;
  discountPrice: number;
  cost: number;
  description: string;
  stockQuantity: number;
  status: number;
}

export interface ProductMutationRequest {
  id?: string;
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

@Injectable({
  providedIn: 'root'
})
export class ProductAdminService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) { }

  getProducts(params: { keyword?: string; categoryId?: string; status?: number }): Observable<ProductAdmin[]> {
    let httpParams = new HttpParams();
    if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
    if (params.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params.status !== undefined && params.status !== null) httpParams = httpParams.set('status', params.status.toString());

    return this.http.get<any>(this.config.getEndpoint('warehouse/product/list'), { params: httpParams }).pipe(
      map((res: any) => {
        const products = Array.isArray(res)
          ? res
          : res?.data || res?.products || [];

        return Array.isArray(products)
          ? products.map((product) => this.normalizeProduct(product))
          : [];
      })
    );
  }



  addProduct(product: ProductMutationRequest): Observable<any> {
    return this.http.post(
      this.config.getEndpoint('product/create'),
      this.buildProductFormData(product)
    );
  }

  updateProduct(product: ProductMutationRequest): Observable<any> {
    return this.http.put(
      this.config.getEndpoint('product/update'),
      this.buildProductFormData(product, true)
    );
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(this.config.getEndpoint(`product/delete/${productId}`));
  }

  private buildProductFormData(product: ProductMutationRequest, includeId = false): FormData {
    const formData = new FormData();

    if (includeId && product.id) {
      formData.append('Id', product.id);
    }

    formData.append('ProductName', product.productName);
    formData.append('Description', product.description ?? '');
    formData.append('Price', String(product.price ?? 0));
    formData.append('CategoryId', product.categoryId);
    formData.append('DonViTinhId', product.donViTinhId);
    formData.append('Status', String(product.status ?? 0));

    if (includeId) {
      formData.append('Image_Url', product.imageUrl ?? '');
    }

    if (product.imageFile) {
      formData.append('ImageFile', product.imageFile);
    }

    return formData;
  }

  private normalizeProduct(product: any): ProductAdmin {
    return {
      ...product,
      id: product.id || product.Id,
      imageUrl:
        product.imageUrl ||
        product.image_Url ||
        product.Image_Url ||
        product.imageURL ||
        '',
      productName: product.productName || product.ProductName || '',
      sku: product.sku || product.SKU || '',
      categoryId: product.categoryId || product.CategoryId || '',
      supplierId: product.supplierId || product.SupplierId || '',
      supplierName: product.supplierName || product.SupplierName || '',
      unitName: product.unitName || product.UnitName || '',
      donViTinhId: product.donViTinhId || product.DonViTinhId || '',
      price: product.price ?? product.Price ?? 0,
      discountPrice: product.discountPrice ?? product.DiscountPrice ?? 0,
      cost: product.cost ?? product.Cost ?? 0,
      description: product.description || product.Description || '',
      stockQuantity: product.stockQuantity ?? product.StockQuantity ?? 0,
      status: product.status ?? product.Status ?? 0
    };
  }
}
