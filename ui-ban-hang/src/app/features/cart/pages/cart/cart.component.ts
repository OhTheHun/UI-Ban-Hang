import { Component, inject, signal, effect, OnInit } from '@angular/core';
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

  customerInfo = signal({
    name: '',
    phone: '',
    address: ''
  });

  paymentMethod = signal('COD');
  isProcessing = signal(false);
  showConfirmModal = signal(false);

  constructor() {
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

  ngOnInit() {
    const user = this.currentUser();
    if (user?.id) {
      this.authService.refreshProfile(user.id);
    }
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

    this.showConfirmModal.set(true);
  }

  confirmOrder() {
    this.showConfirmModal.set(false);
    this.isProcessing.set(true);

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

    this.invoiceService.createInvoice(invoiceRequest).subscribe({
      next: (invoice: any) => {
        const invoiceData = this.getResponseData(invoice);
        const invoiceId = this.getInvoiceId(invoiceData);

        if (!invoiceId) {
          this.toastService.error('Không tìm thấy mã hóa đơn sau khi tạo đơn hàng.');
          this.isProcessing.set(false);
          return;
        }

        const items = this.cartItems().map(item => ({
          invoiceId,
          productId: item.id,
          quantity: item.quantity,
          total: item.price * item.quantity
        }));

        this.invoiceService.addInvoiceItems(items).subscribe({
          next: () => {
            if (this.paymentMethod() === 'VNPAY') {
              this.redirectToVnpay(invoiceId);
              return;
            }

            this.toastService.success('Đặt hàng thành công, cảm ơn bạn đã mua sắm.');
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

  private redirectToVnpay(invoiceId: string): void {
    this.invoiceService.createVnpayPayment({
      invoiceId,
      ipAddress: '127.0.0.1'
    }).subscribe({
      next: (response) => {
        const paymentUrl = this.getPaymentUrl(response);

        if (!paymentUrl) {
          this.toastService.error('Không nhận được đường dẫn thanh toán VNPAY từ hệ thống.');
          this.isProcessing.set(false);
          return;
        }

        this.cartService.clearCart();
        window.location.href = paymentUrl;
      },
      error: (err) => {
        console.error('Create VNPAY payment error:', err);
        this.toastService.error('Không thể mở cổng thanh toán VNPAY. Vui lòng thử lại sau.');
        this.isProcessing.set(false);
      }
    });
  }

  private getResponseData(response: any): any {
    return response?.data || response?.invoice || response;
  }

  private getInvoiceId(response: any): string {
    return response?.id || response?.invoiceId || response?.invoiceID || '';
  }

  private getPaymentUrl(response: any): string {
    if (typeof response === 'string') return response;

    const data = response?.data || response?.payment || response;
    if (typeof data === 'string') return data;

    return (
      data?.paymentUrl ||
      data?.paymentURL ||
      data?.vnpayUrl ||
      data?.vnPayUrl ||
      data?.vnpayURL ||
      data?.url ||
      ''
    );
  }
}
