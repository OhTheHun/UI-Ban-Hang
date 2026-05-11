import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, startWith, shareReplay, combineLatestWith } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, PaginationComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {

  vm$!: Observable<{
    loading: boolean;
    products: any[];
    totalItems: number;
    currentPage: number;
  }>;

  searchTitle = 'Tất cả sản phẩm';
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize = 24;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.vm$ = this.route.queryParams.pipe(
      switchMap(params => {
        const categoryId = params['category'];
        const keyword = params['keyword'];
        this.currentPage$.next(1); // Reset trang về 1 khi tìm kiếm mới hoặc đổi category

        const api$ = categoryId
          ? this.productService.getProductsByCategory(categoryId)
          : this.productService.searchProducts(keyword);

        this.searchTitle = categoryId
          ? 'Sản phẩm theo danh mục'
          : keyword ? `Kết quả tìm kiếm cho "${keyword}"` : 'Tất cả sản phẩm';

        return api$.pipe(
          map(data => (data || []).map(p => this.transformProduct(p))),
          combineLatestWith(this.currentPage$),
          map(([allProducts, currentPage]) => {
            const startIndex = (currentPage - 1) * this.pageSize;
            const paginatedProducts = allProducts.slice(startIndex, startIndex + this.pageSize);

            return {
              loading: false,
              products: paginatedProducts,
              totalItems: allProducts.length,
              currentPage: currentPage
            };
          }),
          catchError(() => of({ loading: false, products: [], totalItems: 0, currentPage: 1 })),
          startWith({ loading: true, products: [], totalItems: 0, currentPage: 1 })
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

  onPageChange(page: number): void {
    this.currentPage$.next(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackByProductId(index: number, product: any): string {
    return product.id;
  }
}