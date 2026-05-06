import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category } from '../models/product.model';
import { ConfigService } from '../../../core/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.config.getEndpoint('Categories'));
  }

  searchProducts(keyword?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    return this.http.get<Product[]>(this.config.getEndpoint('product/list'), { params });
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.config.getEndpoint(`product/list/${categoryId}`));
  }
}
