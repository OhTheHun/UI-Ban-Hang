import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="featured-products">
      <div class="container">
        <h2 class="section-title">Sản Phẩm Nổi Bật</h2>
        <div class="products-grid" *ngIf="products.length > 0">
          <div class="product-card" *ngFor="let product of products; trackBy: trackById">
            <div class="product-image-wrapper">
              <!-- <img [src]="product.image" [alt]="product.name" class="product-image" /> -->
              <div class="product-badge" *ngIf="product.originalPrice">
                -{{ getDiscountPercent(product.price, product.originalPrice) }}%
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
                <span class="current-price">
                  {{ product.price | number:'1.0-0':'vi-VN' }}₫
                </span>

                <span class="original-price" *ngIf="product.originalPrice">
                  {{ product.originalPrice | number:'1.0-0':'vi-VN' }}₫
                </span>
              </div>
            </div>
              <div class="product-actions">
                <button class="btn-add-cart">Thêm Vào Giỏ</button>
              </div>
          </div>
        </div>

        <p *ngIf="products.length === 0">Không có sản phẩm</p>
      </div>
    </section>
  `,
  styleUrls: ['./home_scss/sections.scss', './home_scss/featured-products.component.scss']
})
export class FeaturedProductsComponent {

  products: Product[] = [
    {
      id: 1,
      name: 'Khô Gà Vị Cay',
      category: 'Khô Gà',
      price: 89000,
      originalPrice: 120000,
      image: 'https://placehold.jp/300x300.png?text=Product',
      rating: 4.8,
      reviews: 245
    },
    {
      id: 2,
      name: 'Khô Gà Nướp',
      category: 'Khô Gà',
      price: 79000,
      image: 'https://placehold.jp/300x300.png?text=Product',
      rating: 4.7,
      reviews: 189
    },
    {
      id: 3,
      name: 'Khô Gà Lá Chanh',
      category: 'Khô Gà',
      price: 84000,
      originalPrice: 110000,
      image: 'https://placehold.jp/300x300.png?text=Product',
      rating: 4.9,
      reviews: 312
    },
    {
      id: 4,
      name: 'Khô Gà Xốt Chuối',
      category: 'Khô Gà',
      price: 95000,
      image: 'https://placehold.jp/300x300.png?text=Product',
      rating: 4.6,
      reviews: 156
    }
  ];

  trackById(index: number, item: Product) {
    return item.id;
  }

  getRenderStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getDiscountPercent(price: number, originalPrice: number): number {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }
}