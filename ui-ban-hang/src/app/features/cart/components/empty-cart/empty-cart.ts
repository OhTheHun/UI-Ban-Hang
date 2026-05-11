import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empty-cart',
  standalone: true,
  template: `
    <div class="empty-cart">
      <div class="icon">🛒</div>
      <h2>Giỏ hàng của bạn đang trống</h2>
      <p>Hãy quay lại trang chủ để chọn những sản phẩm ưng ý nhất nhé!</p>
      <button class="go-home-btn" (click)="router.navigate(['/'])">TIẾP TỤC MUA SẮM</button>
    </div>
  `,
  styles: [`
    .empty-cart {
      text-align: center;
      padding: 100px 0;
      .icon { font-size: 80px; margin-bottom: 20px; }
      h2 { font-size: 24px; font-weight: 700; margin-bottom: 15px; }
      p { color: #666; margin-bottom: 30px; }
      .go-home-btn {
        padding: 15px 40px;
        background: #0071bb;
        color: #fff;
        border: none;
        border-radius: 30px;
        font-weight: 700;
        cursor: pointer;
        &:hover { background: #005a96; }
      }
    }
  `]
})
export class EmptyCartComponent {
  router = inject(Router);
}
