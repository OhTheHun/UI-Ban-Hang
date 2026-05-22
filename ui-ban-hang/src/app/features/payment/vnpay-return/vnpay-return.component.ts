import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InvoiceService } from '../../../core/services/invoice.service';

@Component({
  selector: 'app-vnpay-return',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vnpay-return.component.html',
  styleUrl: './vnpay-return.component.scss'
})
export class VnpayReturnComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private invoiceService = inject(InvoiceService);
  private readonly homeUrl = '/home';

  params = computed(() => this.route.snapshot.queryParamMap);
  isSyncing = signal(true);
  backendCode = signal('');
  backendMessage = signal('');

  code = computed(() =>
    this.backendCode() ||
    this.params().get('code') ||
    this.params().get('vnp_ResponseCode') ||
    this.params().get('vnp_TransactionStatus') ||
    ''
  );

  isSuccess = computed(() => {
    const message = (this.backendMessage() || this.params().get('message') || '').toLowerCase();
    return this.code() === '00' || message === 'success' || this.params().keys.length === 0;
  });

  message = computed(() => {
    if (this.isSyncing()) return 'Đang xác nhận kết quả thanh toán với hệ thống...';

    const apiMessage = this.backendMessage() || this.params().get('message');
    if (apiMessage === 'success') return 'Thanh toán VNPAY thành công. Đang đưa bạn về trang chủ...';
    if (apiMessage) return apiMessage;

    return this.isSuccess()
      ? 'Thanh toán VNPAY thành công. Đang đưa bạn về trang chủ...'
      : 'Thanh toán VNPAY chưa hoàn tất.';
  });

  invoiceId = computed(() =>
    this.params().get('invoiceId') ||
    this.params().get('vnp_TxnRef') ||
    ''
  );

  ngOnInit(): void {
    this.syncPaymentResult();
  }

  private syncPaymentResult(): void {
    const queryString = window.location.search;

    if (!queryString) {
      this.isSyncing.set(false);
      this.redirectHomeWhenSuccess();
      return;
    }

    this.invoiceService.syncVnpayCallback(queryString).subscribe({
      next: response => {
        this.applyPaymentResponse(response);
        this.isSyncing.set(false);
        this.redirectHomeWhenSuccess();
      },
      error: err => {
        console.error('Sync VNPAY return error:', err);
        this.isSyncing.set(false);
        this.redirectHomeWhenSuccess();
      }
    });
  }

  private applyPaymentResponse(response: any): void {
    const data = response?.data || response;
    this.backendCode.set(data?.code || data?.responseCode || data?.RspCode || '');
    this.backendMessage.set(data?.message || data?.Message || '');
  }

  private redirectHomeWhenSuccess(): void {
    if (this.isSuccess()) {
      setTimeout(() => {
        this.router.navigateByUrl(this.homeUrl);
      }, 2000);
    }
  }
}
