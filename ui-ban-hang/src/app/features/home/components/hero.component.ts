import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero">
  <div class="hero-overlay">
    <div class="hero-content">
      <h1 class="hero-title">MABIXI - Khô Thịt & Cơm Cháy Chất Lượng Bã Mía</h1>
      <p class="hero-subtitle">
        Sản phẩm chất lượng, giá tốt, giao hàng nhanh chóng. Khám phá ngay hôm nay!
      </p>
      <div class="hero-buttons">
        <button class="btn btn-primary">Mua Sắm Ngay</button>
        <button class="btn btn-secondary">Khám Phá Thêm</button>
      </div>
    </div>
  </div>
</section>
  `,
  styleUrls: [
  './home_scss/hero.component.scss',
  './sections.scss'
]
})
export class HeroComponent {}
