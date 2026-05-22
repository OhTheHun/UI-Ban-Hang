import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        const user = this.authService.currentUser();

        if (user && ['Admin', 'Seller', 'WareHouseManager', 'HR'].includes(user.role)) {

          this.toast.success('Đăng nhập quản trị thành công!');

          if (user.role === 'Admin') {
            this.router.navigate(['/Operations/dashboard']);
          }
          else if (user.role === 'Seller') {
            this.router.navigate(['/Operations/approvals']);
          }
          else if (user.role === 'WareHouseManager') {
            this.router.navigate(['/Operations/products']);
          }
          else if (user.role === 'HR') {
            this.router.navigate(['/Operations/staff']);
          }

        } else {
          this.toast.error('Tài khoản không có quyền truy cập trang quản trị.');
          this.authService.logout();
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err.message || 'Đăng nhập thất bại. Kiểm tra lại tài khoản/mật khẩu.');
      }
    });
  }
}
