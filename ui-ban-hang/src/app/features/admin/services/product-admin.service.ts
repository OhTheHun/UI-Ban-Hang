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

    return this.http.get<any>(this.config.getEndpoint('admin/product/list'), { params: httpParams }).pipe(
      map((res: any) => {
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res.data)) return res.data;
        if (res && Array.isArray(res.products)) return res.products; // Just in case
        return [];
      })
    );
  }



  addProduct(product: Partial<ProductAdmin>): Observable<any> {
    return this.http.post(this.config.getEndpoint('product/create'), product);
  }

  updateProduct(product: Partial<ProductAdmin>): Observable<any> {
    return this.http.put(this.config.getEndpoint('product/update'), product);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(this.config.getEndpoint(`product/delete/${productId}`));
  }
}

