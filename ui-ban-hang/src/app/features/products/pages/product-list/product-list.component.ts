import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, startWith, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {

  vm$!: Observable<{
    loading: boolean;
    products: any[];
  }>;

  searchTitle = 'Tất cả sản phẩm';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.vm$ = this.route.queryParams.pipe(
      switchMap(params => {
        const categoryId = params['category'];
        const keyword = params['keyword'];

        const api$ = categoryId
          ? this.productService.getProductsByCategory(categoryId)
          : this.productService.searchProducts(keyword);

        this.searchTitle = categoryId
          ? 'Sản phẩm theo danh mục'
          : keyword ? `Kết quả tìm kiếm cho "${keyword}"` : 'Tất cả sản phẩm';

        return api$.pipe(
          map(data => ({
            loading: false,
            products: (data || []).map(p => this.transformProduct(p))
          })),
          catchError(() => of({ loading: false, products: [] })),
          startWith({ loading: true, products: [] })
        );
      }),
      shareReplay(1) // cache tránh gọi lại
    );
  }

  private transformProduct(p: any): any {
    return {
      ...p,
      discountPercent: p.discountPrice > 0
        ? Math.round(((p.price - p.discountPrice) / p.price) * 100)
        : 0,
      currentPrice: p.discountPrice > 0 ? p.discountPrice : p.price,
      hasDiscount: p.discountPrice > 0 && p.discountPrice < p.price
    };
  }

  trackByProductId(index: number, product: any): string {
    return product.id;
  }
}