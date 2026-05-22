import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { UserAdminService } from '../../services/user-admin.service';

@Component({
  selector: 'app-operation-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './operation-account.component.html',
  styleUrl: './operation-account.component.scss'
})
export class OperationAccountComponent {
  private authService = inject(AuthService);
  private userAdminService = inject(UserAdminService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  user = computed(() => this.authService.currentUser());
  selectedFileName = signal('');
  previewUrl = signal('');
  isUploading = signal(false);
  isChangingPassword = signal(false);

  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toastService.warning('Vui lòng chọn file hình ảnh');
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastService.warning('Ảnh không được vượt quá 5MB');
      input.value = '';
      return;
    }

    this.selectedFileName.set(file.name);
    this.previewUrl.set(URL.createObjectURL(file));
    this.uploadAvatar(file);
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } =
      this.passwordForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.passwordForm.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }

    const userId = this.user()?.id;
    if (!userId || !currentPassword || !newPassword || !confirmPassword) {
      this.toastService.error('Không tìm thấy thông tin tài khoản');
      return;
    }

    this.isChangingPassword.set(true);

    this.userAdminService
      .changePassword(userId, {
        oldPassword: currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword
      })
      .subscribe({
        next: () => {
          this.toastService.success('Đổi mật khẩu thành công');
          this.passwordForm.reset();
          this.isChangingPassword.set(false);
        },
        error: (err) => {
          this.toastService.error('Không thể đổi mật khẩu');
          this.isChangingPassword.set(false);
        }
      });
  }

  private uploadAvatar(file: File): void {
    const userId = this.user()?.id;

    if (!userId) {
      this.toastService.error('Không tìm thấy thông tin tài khoản');
      return;
    }

    this.isUploading.set(true);

    this.userAdminService.uploadAvatar(userId, file).subscribe({
      next: (response) => {
        const avatarUrl = this.getAvatarUrl(response) || this.previewUrl();

        this.authService.updateCurrentUserAvatar(avatarUrl);
        this.toastService.success('Cập nhật ảnh đại diện thành công');
        this.isUploading.set(false);
      },
      error: (err) => {
        this.toastService.error('Không thể tải ảnh lên');
        this.isUploading.set(false);
      }
    });
  }

  private getAvatarUrl(response: any): string {
    const data = response?.data || response;

    return (
      data?.image ||
      data?.avatar ||
      data?.avatarUrl ||
      data?.imageUrl ||
      data?.url ||
      ''
    );
  }
}
