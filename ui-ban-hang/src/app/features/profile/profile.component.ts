import { Component, OnInit, signal, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    ReactiveFormsModule,
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
  public readonly isUploadingAvatar = signal<boolean>(false);
  public readonly avatarPreviewUrl = signal<string>('');
  public readonly isChangingPassword = signal<boolean>(false);

  public readonly orders = signal<OrderSummary[]>([]);
  public readonly isLoadingOrders = signal<boolean>(false);
  public readonly selectedOrder = signal<OrderDetail | null>(null);
  passwordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private userService: UserService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    });
  }

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
          const avatarUrl = this.getProfileAvatar(profile);
          if (avatarUrl) {
            this.authService.updateCurrentUserAvatar(avatarUrl);
          }
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

  confirmCancelOrder(reason: string): void {
    const invoiceId = this.cancelInvoiceId();
    if (!invoiceId) return;

    const user = this.authUser();
    if (!user?.id) {
      this.toastService.error('KhÃ´ng tÃ¬m tháº¥y thÃ´ng tin tÃ i khoáº£n.');
      this.cancelInvoiceId.set(null);
      return;
    }

    this.orderService.cancelOrder(invoiceId, user.id.toString(), reason).subscribe({
      next: () => {
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
      this.isLoadingProfile.set(true);
      this.userService.updateProfile(user.id.toString(), {
        fullName: updatedProfile.fullName,
        phone: updatedProfile.phone,
        address: updatedProfile.address
      })
      .pipe(finalize(() => this.isLoadingProfile.set(false)))
      .subscribe({
        next: (response) => {
          this.userProfile.set({
            ...updatedProfile,
            ...response
          });
          this.authService.refreshProfile(user.id.toString());
          this.toastService.success('Cập nhật thông tin thành công!');
        },
        error: (err) => this.toastService.error('Lỗi khi cập nhật thông tin.')
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }

  handleAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toastService.warning('Vui lòng chọn file hình ảnh.');
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastService.warning('Ảnh không được vượt quá 5MB.');
      input.value = '';
      return;
    }

    const user = this.authUser();
    if (!user?.id) {
      this.toastService.error('Không tìm thấy thông tin tài khoản.');
      return;
    }

    this.avatarPreviewUrl.set(URL.createObjectURL(file));
    this.isUploadingAvatar.set(true);

    this.userService.uploadAvatar(user.id.toString(), file)
      .pipe(finalize(() => this.isUploadingAvatar.set(false)))
      .subscribe({
        next: (response) => {
          const currentProfile = this.userProfile();
          const avatarUrl = this.getProfileAvatar(response) || this.avatarPreviewUrl();

          if (currentProfile) {
            this.userProfile.set({
              ...currentProfile,
              image: avatarUrl
            });
          }

          this.authService.updateCurrentUserAvatar(avatarUrl);
          this.toastService.success('Cập nhật ảnh đại diện thành công!');
        },
        error: (err) => {
          console.error('Failed to upload avatar', err);
          this.avatarPreviewUrl.set('');
          this.toastService.error('Không thể cập nhật ảnh đại diện.');
        }
      });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { oldPassword, newPassword, confirmNewPassword } =
      this.passwordForm.getRawValue();

    if (newPassword !== confirmNewPassword) {
      this.passwordForm.get('confirmNewPassword')?.setErrors({ mismatch: true });
      return;
    }

    const user = this.authUser();
    if (!user?.id || !oldPassword || !newPassword || !confirmNewPassword) {
      this.toastService.error('Không tìm thấy thông tin tài khoản.');
      return;
    }

    this.isChangingPassword.set(true);

    this.userService.changePassword(user.id.toString(), {
      oldPassword,
      newPassword,
      confirmNewPassword
    })
      .pipe(finalize(() => this.isChangingPassword.set(false)))
      .subscribe({
        next: () => {
          this.passwordForm.reset();
          this.toastService.success('Đổi mật khẩu thành công!');
        },
        error: (err) => {
          console.error('Failed to change password', err);
          this.toastService.error('Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.');
        }
      });
  }

  getAvatarSrc(): string {
    if (this.avatarPreviewUrl()) return this.avatarPreviewUrl();

    const profile = this.userProfile();
    const avatarUrl = profile ? this.getProfileAvatar(profile) : '';

    if (avatarUrl) return avatarUrl;

    const name = profile?.fullName || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d47a1&color=fff`;
  }

  private getProfileAvatar(profile: UserProfileResponse): string {
    return (
      profile.image ||
      profile.avatar ||
      profile.avatarUrl ||
      profile.imageUrl ||
      profile.url ||
      ''
    );
  }
}
