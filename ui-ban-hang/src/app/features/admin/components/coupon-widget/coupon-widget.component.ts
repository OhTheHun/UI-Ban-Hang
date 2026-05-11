import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Coupon } from '../../models/order-management.models';

@Component({
  selector: 'app-coupon-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="coupons-card">
      <div class="card-header">
        <div class="title"><i class="ph ph-tag"></i> Mã giảm giá</div>
        <button class="btn-add"><i class="ph ph-plus"></i></button>
      </div>

      <div class="coupon-list">
        @for (coupon of coupons; track coupon.code) {
          <div class="coupon-item" [class.active]="coupon.status === 'active'" [class.expired]="coupon.status === 'expired'">
            <div class="c-left">
              <div class="c-code">
                {{ coupon.code }} 
                <span class="badge" [class.expired-badge]="coupon.status === 'expired'">
                  {{ coupon.status === 'active' ? 'Đang chạy' : 'Hết hạn' }}
                </span>
              </div>
              <div class="c-date"><i class="ph ph-calendar"></i> {{ coupon.expiryText }}</div>
            </div>
            <div class="c-right" 
                 [class.red]="coupon.discountType === 'percentage'"
                 [class.blue]="coupon.discountType === 'free_ship'">
              {{ coupon.discountText }}
            </div>
          </div>
        }
      </div>

      <div class="card-footer">
        <a href="#">Xem tất cả mã giảm giá</a>
      </div>
    </div>
  `,
  styleUrl: './coupon-widget.component.scss'
})
export class CouponWidgetComponent {
  @Input({ required: true }) coupons: Coupon[] = [];
}
