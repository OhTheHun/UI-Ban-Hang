import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-summary">
      <div class="payment-method">
        <label>Phương thức thanh toán</label>
        <div class="method-options">
          <label class="option" [class.active]="paymentMethod === 'COD'">
            <input
              type="radio"
              name="payment"
              value="COD"
              [checked]="paymentMethod === 'COD'"
              (change)="onPaymentMethodChange.emit('COD')">
            <i class="ph ph-money"></i>
            COD (Thanh toán khi nhận hàng)
          </label>

          <label class="option" [class.active]="paymentMethod === 'VNPAY'">
            <input
              type="radio"
              name="payment"
              value="VNPAY"
              [checked]="paymentMethod === 'VNPAY'"
              (change)="onPaymentMethodChange.emit('VNPAY')">
            <i class="ph ph-bank"></i>
            Chuyển khoản qua VNPAY
          </label>
        </div>
      </div>

      <div class="order-summary">
        <div class="summary-row">
          <span>Tổng tiền hàng:</span>
          <span>{{ totalPrice | number:'1.0-0' }} đ</span>
        </div>
        <div class="summary-row">
          <span>Phí vận chuyển:</span>
          <span>Miễn phí</span>
        </div>
        <hr>
        <div class="summary-row total">
          <span>Thanh toán:</span>
          <span>{{ totalPrice | number:'1.0-0' }} đ</span>
        </div>
      </div>

      <button
        class="checkout-btn"
        (click)="onCheckout.emit()"
        [disabled]="isProcessing"
      >
        {{ isProcessing ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG' }}
      </button>
    </div>
  `,
  styles: [`
    .cart-summary {
      .payment-method {
        margin-bottom: 30px;
        label { display: block; font-size: 14px; font-weight: 600; color: #666; margin-bottom: 10px; }
        .method-options {
          display: grid; gap: 10px;
          .option {
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              border-color: #0071bb;
              background: #f8fbff;
            }

            &.active {
              border-color: #0071bb;
              background: #f0f7ff;
              font-weight: 600;
              color: #0f172a;
            }

            input { width: auto; }
          }
        }
      }

      .order-summary {
        margin-bottom: 30px;
        .summary-row {
          display: flex; justify-content: space-between; margin-bottom: 10px;
          color: #666;
          &.total {
            color: #333; font-size: 20px; font-weight: 800;
            span:last-child { color: #ef4444; }
          }
        }
        hr { border: none; border-top: 1px solid #eee; margin: 15px 0; }
      }

      .checkout-btn {
        width: 100%;
        height: 54px;
        background: #0071bb;
        color: #fff;
        border: none;
        border-radius: 27px;
        font-size: 18px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
        &:hover { background: #005a96; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,113,187,0.3); }
        &:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }
      }
    }
  `]
})
export class CartSummaryComponent {
  @Input({ required: true }) totalPrice!: number;
  @Input({ required: true }) paymentMethod!: string;
  @Input({ required: true }) isProcessing!: boolean;
  @Output() onPaymentMethodChange = new EventEmitter<string>();
  @Output() onCheckout = new EventEmitter<void>();
}
