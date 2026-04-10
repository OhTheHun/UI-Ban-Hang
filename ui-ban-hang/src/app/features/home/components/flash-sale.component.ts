import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
}

@Component({
  selector: 'app-flash-sale',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="flash-sale">
      <div class="container">
        <div class="flash-sale-header">
          <h2 class="section-title"> Flash Sale</h2>
          <div class="flash-timer">
            <span class="timer-label">Kết Thúc Trong:</span>
            <div class="timer">02:45:30</div>
          </div>
        </div>
        <div class="products-grid">
          <div class="product-card" *ngFor="let product of flashSaleProducts">
            <div class="product-image-wrapper">
              <!-- <img [src]="product.image" [alt]="product.name" class="product-image" /> -->
              <div class="product-badge flash-badge">
                -{{ getDiscountPercent(product.price, product.originalPrice!) }}%
              </div>
            </div>
            <div class="product-info">
              <span class="product-category">{{ product.category }}</span>
              <h4 class="product-name">{{ product.name }}</h4>
              <div class="product-rating">
                <span class="stars" *ngFor="let star of getRenderStars(product.rating)">★</span>
                <span class="review-count">({{ product.reviews }})</span>
              </div>
              <div class="product-price">
                <span class="current-price">{{ product.price | number:'1.0-0':'vi-VN' }}₫</span>
                <span class="original-price">
                  {{ product.originalPrice | number:'1.0-0':'vi-VN' }}₫
                </span>
              </div>
              <button class="btn-add-cart">Thêm Vào Giỏ</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./home_scss/sections.scss', './home_scss/featured-products.component.scss']
})
export class FlashSaleComponent {
  @Input() flashSaleProducts: Product[] = [];

  getRenderStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getDiscountPercent(price: number, originalPrice: number): number {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }
}
