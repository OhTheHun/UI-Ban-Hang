import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderSummary } from '../../models/order.model';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {
  private _orders = signal<OrderSummary[]>([]);
  @Input() set orders(value: OrderSummary[]) {
    this._orders.set(value);
    this.currentPage.set(1);
  }
  get orders() { return this._orders(); }
  @Input() isLoading = false;
  @Output() onViewDetail = new EventEmitter<string>();

  currentPage = signal(1);
  pageSize = signal(5);

  paginatedOrders = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.orders.slice(start, end);
  });

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  getStatusClass(status: string): string {
    const s = status?.toLowerCase() || '';
    if (s.includes('cancel')) return 'status-cancelled';
    if (s === 'delivered' || s === 'completed') return 'status-delivered';
    if (s === 'shipping' || s === 'delivering') return 'status-shipping';
    return 'status-processing';
  }

  getStatusLabel(status: string): string {
    const s = status?.toLowerCase() || '';
    const map: Record<string, string> = {
      'pending': 'Đang chờ',
      'processing': 'Đang xử lý',
      'shipping': 'Đang giao',
      'delivering': 'Đang giao',
      'delivered': 'Hoàn thành',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return map[s] || status;
  }
}
