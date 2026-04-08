import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="newsletter">
      <div class="container newsletter-content">
        <div class="newsletter-text">
          <h2>Đăng Ký Nhận Tin Tức & Khuyến Mãi</h2>
          <p>Nhận thông tin mới nhất về sản phẩm và các đợt giảm giá hấp dẫn</p>
        </div>
        <form class="newsletter-form">
          <input type="email" placeholder="Nhập email của bạn..." class="newsletter-input" required />
          <button type="submit" class="btn btn-primary">Đăng Ký</button>
        </form>
      </div>
    </section>
  `,
  styleUrls: ['./sections.scss', './home_scss/featured-products.component.scss']  
})
export class NewsletterComponent {}
