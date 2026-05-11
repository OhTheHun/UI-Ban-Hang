import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shipping-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="shipping-form">
      <h2 class="card-title">Thông tin giao hàng</h2>
      
      <div class="form-group">
        <label>Họ và tên</label>
        <input type="text" [(ngModel)]="info.name" placeholder="Nhập tên người nhận">
      </div>

      <div class="form-group">
        <label>Số điện thoại</label>
        <input type="tel" [(ngModel)]="info.phone" placeholder="Nhập số điện thoại">
      </div>

      <div class="form-group">
        <label>Địa chỉ nhận hàng</label>
        <textarea [(ngModel)]="info.address" placeholder="Địa chỉ chi tiết (Số nhà, đường, phường/xã...)"></textarea>
      </div>
    </div>
  `,
  styles: [`
    .shipping-form {
      .card-title {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 25px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
      }

      .form-group {
        margin-bottom: 20px;
        label { display: block; font-size: 14px; font-weight: 600; color: #666; margin-bottom: 8px; }
        input, textarea {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          &:focus { border-color: #0071bb; outline: none; }
        }
        textarea { height: 100px; resize: none; }
      }
    }
  `]
})
export class ShippingFormComponent {
  @Input({ required: true }) info!: { name: string; phone: string; address: string };
}
