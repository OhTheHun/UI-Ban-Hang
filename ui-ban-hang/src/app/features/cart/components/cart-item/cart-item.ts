import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-item">
      <img [src]="item.image" [alt]="item.name" class="item-image">
      <div class="item-details">
        <h3 class="item-name">{{ item.name }}</h3>
        <p class="item-price">{{ item.price | number:'1.0-0' }} đ</p>
        
        <div class="item-actions">
          <div class="qty-control">
            <button (click)="onUpdateQty.emit(-1)">-</button>
            <span class="val">{{ item.quantity }}</span>
            <button (click)="onUpdateQty.emit(1)">+</button>
          </div>
          <button class="remove-btn" (click)="onRemove.emit()">Xóa</button>
        </div>
      </div>
      <div class="item-total">
        {{ (item.price * item.quantity) | number:'1.0-0' }} đ
      </div>
    </div>
  `,
  styles: [`
    .cart-item {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px 0;
      border-bottom: 1px solid #eee;
      
      &:last-child { border-bottom: none; }

      .item-image {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid #eee;
      }

      .item-details {
        flex: 1;
        .item-name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .item-price {
          color: #ef4444;
          font-weight: 700;
          margin-bottom: 15px;
        }
      }

      .item-actions {
        display: flex;
        align-items: center;
        gap: 20px;

        .qty-control {
          display: flex;
          border: 1px solid #ddd;
          border-radius: 4px;
          button {
            background: none; border: none; padding: 5px 12px; cursor: pointer;
            &:hover { background: #f5f5f5; }
          }
          .val { width: 30px; text-align: center; border-left: 1px solid #ddd; border-right: 1px solid #ddd; font-weight: 600; }
        }

        .remove-btn {
          background: none; border: none; color: #999; cursor: pointer;
          font-size: 14px;
          &:hover { color: #ef4444; }
        }
      }

      .item-total {
        font-size: 18px;
        font-weight: 700;
        color: #333;
        width: 120px;
        text-align: right;
      }
    }
  `]
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  @Output() onUpdateQty = new EventEmitter<number>();
  @Output() onRemove = new EventEmitter<void>();
}
