import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { InvoiceApprovalDTO } from '../../models/invoice-approval.dto';
import { InvoiceAdminService } from '../../services/invoice-admin.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-order-approval',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-approval.component.html',
  styleUrls: ['./order-approval.component.scss']
})
export class OrderApprovalComponent implements OnInit {

  activeTab: 'pending' | 'processing' | 'delivering' | 'history' = 'pending';

  selectedOrder = signal<InvoiceApprovalDTO | null>(null);

  showRejectInput = signal(false);

  isLoading = signal(false);
  isDetailLoading = signal(false);

  rejectReason = '';
  isUpdating = false;

  allOrders: InvoiceApprovalDTO[] = [];
  historyOrders: InvoiceApprovalDTO[] = [];

  constructor(
    private invoiceService: InvoiceAdminService,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.isLoading.set(true);
    const userId = this.authService.currentUser()?.id || '';

    // Fetch orders for approval
    this.invoiceService
      .getInvoicesForApproval()
      .subscribe({
        next: (res: any[]) => {
          this.allOrders = (res || []).map(item => this.mapInvoice(item));
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to fetch orders', err);
          this.isLoading.set(false);
        }
      });

    // Fetch processed history
    if (userId) {
      this.invoiceService
        .getProcessedOrders(userId)
        .subscribe({
          next: (res: any[]) => {
            this.historyOrders = (res || []).map(item => this.mapInvoice(item));
          },
          error: (err) => {
            console.error('Failed to fetch history orders', err);
          }
        });
    }
  }

  selectOrder(order: InvoiceApprovalDTO): void {

    this.selectedOrder.set(order);

    this.showRejectInput.set(false);
    this.rejectReason = '';

    if (!order?.id) {
      console.error('Order ID is undefined!', order);
      return;
    }

    this.isDetailLoading.set(true);

    this.invoiceService
      .getInvoiceDetail(order.id)
      .pipe(
        finalize(() => this.isDetailLoading.set(false))
      )
      .subscribe({
        next: (detail: any) => {

          const merged = {
            ...order,
            ...detail
          };

          this.selectedOrder.set(
            this.mapInvoice(merged)
          );
        },
        error: (err) => {
          console.error('Failed to fetch order detail', err);
        }
      });
  }

  updateStatus(newStatus: number): void {

    const order = this.selectedOrder();
    const userId = this.authService.currentUser()?.id || '';

    if (!order || !order.id || this.isUpdating) {
      return;
    }

    this.isUpdating = true;

    const apiMap: Record<number, any> = {
      1: this.invoiceService.updateProcessing(order.id, userId),
      2: this.invoiceService.updateDelivering(order.id, userId),
      3: this.invoiceService.updateCompleted(order.id, userId),
      4: this.invoiceService.cancelInvoice(order.id, userId)
    };

    const apiCall$ = apiMap[newStatus];

    if (!apiCall$) {
      this.isUpdating = false;
      return;
    }

    apiCall$
      .pipe(
        finalize(() => {
          this.isUpdating = false;
        })
      )
      .subscribe({
        next: () => {
          this.toastService.success('Cập nhật trạng thái đơn hàng thành công');

          const updatedOrder: InvoiceApprovalDTO = {
            ...order,
            status: newStatus,
            processedAt: new Date().toISOString()
          };

          this.selectedOrder.set(updatedOrder);

          this.allOrders = this.allOrders.map(o =>
            o.id === updatedOrder.id
              ? updatedOrder
              : o
          );

          this.switchTabByStatus(newStatus);
        },
        error: (err: any) => {
          this.toastService.error('Cập nhật thất bại. Vui lòng thử lại.');
          console.error('Update status error:', err);
        }
      });
  }

  confirmReject(): void {

    if (!this.rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    this.showRejectInput.set(false);

    this.updateStatus(4);
  }

  private mapInvoice(res: any): InvoiceApprovalDTO {

    return {
      id: String(
        res?.id ??
        res?.Id ??
        res?.invoiceId ??
        res?.InvoiceId ??
        res?._id ??
        res?.invoice_id ??
        ''
      ),

      code:
        res?.code ??
        res?.Code ??
        'N/A',

      fullName:
        res?.customerName ??
        res?.CustomerName ??
        res?.fullName ??
        'N/A',

      phone:
        res?.phone ??
        res?.Phone ??
        '',

      address:
        res?.address ??
        res?.Address ??
        '',

      totalAmount:
        Number(
          res?.totalAmount ??
          res?.TotalAmount ??
          0
        ),

      status:
        this.mapStatusStringToNumber(
          res?.status ??
          res?.Status
        ),

      createdAt:
        res?.createdTime ??
        res?.CreatedTime ??
        new Date().toISOString(),

      processedAt:
        res?.processedAt ??
        res?.ProcessedAt,

      items:
        res?.items ??
        res?.Items ??
        []
    };
  }

  private mapStatusStringToNumber(
    status: string | number
  ): number {

    if (typeof status === 'number') {
      return status;
    }

    const statusMap: Record<string, number> = {
      Confirmed: 0,
      Processing: 1,
      Delivering: 2,
      Completed: 3,
      Canceled: 4,
      'Chờ duyệt': 0,
      'Đã xác nhận': 0,
      'Đang xử lý': 1,
      'Đang giao': 2,
      'Hoàn thành': 3,
      'Đã hủy': 4
    };

    return statusMap[status] ?? 0;
  }

  get pendingOrders(): InvoiceApprovalDTO[] {
    return this.allOrders.filter(o => o.status === 0);
  }

  get processingOrders(): InvoiceApprovalDTO[] {
    return this.allOrders.filter(o => o.status === 1);
  }

  get deliveringOrders(): InvoiceApprovalDTO[] {
    return this.allOrders.filter(o => o.status === 2);
  }

  get completedOrders(): InvoiceApprovalDTO[] {
    return this.allOrders.filter(o => [3, 4].includes(o.status));
  }

  getDisplayOrders(): InvoiceApprovalDTO[] {

    switch (this.activeTab) {

      case 'pending':
        return this.pendingOrders;

      case 'processing':
        return this.processingOrders;

      case 'delivering':
        return this.deliveringOrders;

      case 'history':
        return this.historyOrders;

      default:
        return [];
    }
  }

  private switchTabByStatus(status: number): void {

    if (status === 1) {
      this.activeTab = 'processing';
    }
    else if (status === 2) {
      this.activeTab = 'delivering';
    }
    else if ([3, 4].includes(status)) {
      this.activeTab = 'history';
    }
  }

  getStatusText(status: number): string {

    const map: Record<number, string> = {
      0: 'Chờ duyệt',
      1: 'Đang xử lý',
      2: 'Đang giao',
      3: 'Hoàn thành',
      4: 'Đã hủy'
    };

    return map[status] || 'Không xác định';
  }
}