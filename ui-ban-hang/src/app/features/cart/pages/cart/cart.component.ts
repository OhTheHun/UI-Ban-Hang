import { Component, inject, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { InvoiceService, CreateInvoiceRequest } from '../../../../core/services/invoice.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

import { CartItemComponent } from '../../components/cart-item/cart-item';
import { ShippingFormComponent } from '../../components/shipping-form/shipping-form';
import { CartSummaryComponent } from '../../components/cart-summary/cart-summary';
import { EmptyCartComponent } from '../../components/empty-cart/empty-cart';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CartItemComponent,
    ShippingFormComponent,
    CartSummaryComponent,
    EmptyCartComponent,
    ConfirmModalComponent
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  invoiceService = inject(InvoiceService);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;
  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.authService.currentUser;

  // Checkout info
  customerInfo = signal({
    name: '',
    phone: '',
    address: ''
  });

  paymentMethod = signal('COD');
  isProcessing = signal(false);
  showConfirmModal = signal(false);

  ngOnInit() {
    // Luôn làm mới thông tin profile khi vào giỏ hàng để đảm bảo có địa chỉ/sdt mới nhất
    const user = this.currentUser();
    if (user && user.id) {
      this.authService.refreshProfile(user.id);
    }
  }

  constructor() {
    // Tự động điền thông tin nếu đã đăng nhập và có dữ liệu
    effect(() => {
      const user = this.currentUser();
      if (user) {
        this.customerInfo.set({
          name: user.fullname || '',
          phone: user.phone || '',
          address: user.address || ''
        });
      }
    }, { allowSignalWrites: true });
  }

  updateQty(id: string, delta: number) {
    const item = this.cartItems().find(i => i.id === id);
    if (item) {
      this.cartService.updateQuantity(id, item.quantity + delta);
    }
  }

  removeItem(id: string) {
    this.cartService.removeFromCart(id);
  }

  onCheckout() {
    const info = this.customerInfo();
    if (!info.name || !info.phone || !info.address) {
      this.toastService.warning('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    // Mở modal xác nhận thay vì window.confirm
    this.showConfirmModal.set(true);
  }

  confirmOrder() {
    this.showConfirmModal.set(false);
    this.isProcessing.set(true);

    // 1. Create Invoice
    const user = this.currentUser();
    const info = this.customerInfo();

    const invoiceRequest: CreateInvoiceRequest = {
      customerId: user?.id || null,
      fullName: info.name,
      phone: info.phone,
      address: info.address,
      paymentMethod: this.paymentMethod(),
      totalAmount: this.totalPrice()
    };

    console.log('Sending invoice request:', invoiceRequest);

    this.invoiceService.createInvoice(invoiceRequest).subscribe({
      next: (invoice: any) => {
        console.log('Invoice created successfully:', invoice);
        // 2. Add List Items
        const items = this.cartItems().map(item => ({
          invoiceId: invoice.id,
          productId: item.id,
          quantity: item.quantity,
          total: item.price * item.quantity
        }));

        console.log('Adding invoice items:', items);
        this.invoiceService.addInvoiceItems(items).subscribe({
          next: () => {
            this.toastService.success('Đặt hàng thành công, Cảm ơn bạn đã mua sắm.');
            this.cartService.clearCart();
            this.isProcessing.set(false);
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Add items error:', err);
            this.toastService.error('Có lỗi xảy ra khi thêm sản phẩm vào hóa đơn.');
            this.isProcessing.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Create invoice error:', err);
        this.toastService.error('Không thể tạo hóa đơn. Vui lòng thử lại sau.');
        this.isProcessing.set(false);
      }
    });
  }
}
