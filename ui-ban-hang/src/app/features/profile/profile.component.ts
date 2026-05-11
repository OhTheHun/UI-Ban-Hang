import { Component, OnInit, signal, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth/services/auth.service';
import { OrderService } from './services/order.service';
import { UserService } from './services/user.service';
import { ToastService } from '../../core/services/toast.service';
import { UserProfileResponse } from './models/user.model';
import { OrderSummary, OrderDetail } from './models/order.model';
import { User } from '../auth/models/auth.model';

import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { CancelOrderPopupComponent } from './components/cancel-order-popup/cancel-order-popup.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProfileInfoComponent,
    OrderListComponent,
    OrderDetailComponent,
    CancelOrderPopupComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public readonly activeTab = signal<'profile' | 'orders'>('profile');

  private readonly authUser = computed(() => this.authService.currentUser());

  public readonly userProfile = signal<UserProfileResponse | null>(null);
  public readonly isLoadingProfile = signal<boolean>(false);

  public readonly orders = signal<OrderSummary[]>([]);
  public readonly isLoadingOrders = signal<boolean>(false);
  public readonly selectedOrder = signal<OrderDetail | null>(null);

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private userService: UserService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    const user = this.authUser();
    if (user && user.id) {
      this.loadUserProfile(user.id.toString());
      this.loadOrders(user.id.toString());
    }

    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'orders') {
        this.activeTab.set('orders');
      } else {
        this.activeTab.set('profile');
      }
    });
  }

  loadUserProfile(userId: string): void {
    this.isLoadingProfile.set(true);
    this.userService.getUserProfile(userId)
      .pipe(finalize(() => this.isLoadingProfile.set(false)))
      .subscribe({
        next: (profile) => {
          this.userProfile.set(profile);
        },
        error: (err) => {
          console.error('Failed to load user profile. Check CORS or Token.', err);
        }
      });
  }

  setTab(tab: 'profile' | 'orders'): void {
    this.activeTab.set(tab);
    const user = this.authUser();
    if (tab === 'orders' && this.orders().length === 0 && user?.id) {
      this.loadOrders(user.id.toString());
    }
  }

  loadOrders(userId: string): void {
    this.isLoadingOrders.set(true);
    this.orderService.getOrdersByUser(userId)
      .pipe(finalize(() => this.isLoadingOrders.set(false)))
      .subscribe({
        next: (data) => this.orders.set(data),
        error: (err) => console.error('Failed to load orders', err)
      });
  }

  viewOrderDetail(invoiceId: string): void {
    console.log('Fetching detail for invoice ID:', invoiceId);
    this.orderService.getOrderDetail(invoiceId).subscribe({
      next: (detail) => {
        console.log('Order detail received:', detail);
        // Inject the invoiceId since the backend detail response doesn't include it
        this.selectedOrder.set({ ...detail, invoiceId });
      },
      error: (err) => {
        console.error('Failed to load order detail', err);
        this.toastService.error('Không thể tải chi tiết đơn hàng. Vui lòng kiểm tra Console (F12).');
      }
    });
  }

  closeDetail(): void {
    this.selectedOrder.set(null);
  }

  cancelInvoiceId = signal<string | null>(null);

  handleCancelOrder(invoiceId: string): void {
    this.cancelInvoiceId.set(invoiceId);
  }

  confirmCancelOrder(): void {
    const invoiceId = this.cancelInvoiceId();
    if (!invoiceId) return;

    this.orderService.cancelOrder(invoiceId).subscribe({
      next: () => {
        const user = this.authUser();
        if (user?.id) this.loadOrders(user.id.toString());
        this.closeDetail();
        this.cancelInvoiceId.set(null); // Close popup
        this.toastService.success('Đã hủy đơn hàng thành công.');
      },
      error: (err) => {
        this.toastService.error('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
        this.cancelInvoiceId.set(null); // Close popup
      }
    });
  }

  closeCancelPopup(): void {
    this.cancelInvoiceId.set(null);
  }

  handleSaveProfile(updatedProfile: UserProfileResponse): void {
    const user = this.authUser();
    if (user?.id) {
      this.userService.updateProfile(user.id.toString(), {
        fullName: updatedProfile.fullName,
        phone: updatedProfile.phone,
        address: updatedProfile.address
      }).subscribe({
        next: () => {
          this.userProfile.set(updatedProfile);
          this.toastService.success('Cập nhật thông tin thành công!');
        },
        error: (err) => this.toastService.error('Lỗi khi cập nhật thông tin.')
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
