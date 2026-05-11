import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  DashboardStats,
  ChartDataItem,
  TransactionItem,
  InvoiceStatus
} from '../../models/dashboard.models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  today = new Date().toLocaleDateString('vi-VN');

  stats!: DashboardStats;

  chartData: ChartDataItem[] = [];
  recentTransactions: TransactionItem[] = [];

  loading = false;
  errorMessage = '';

  constructor() { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.errorMessage = '';

    // Dữ liệu mock tĩnh hoàn toàn (theo yêu cầu user: xóa tích hợp api dashboard)
    this.stats = {
      totalRevenue: 542500000,
      totalProfit: 162750000,
      totalOrders: 1248,
      newCustomers: 156,
      revenueChangePercent: 18.4,
      profitChangePercent: 12.5,
      ordersChangePercent: 8.2,
      customersChangePercent: 4.5
    };

    this.chartData = [
      { label: 'Tháng 1', revenue: 350000000, profit: 105000000 },
      { label: 'Tháng 2', revenue: 420000000, profit: 126000000 },
      { label: 'Tháng 3', revenue: 380000000, profit: 114000000 },
      { label: 'Tháng 4', revenue: 490000000, profit: 147000000 },
      { label: 'Tháng 5', revenue: 542500000, profit: 162750000 },
      { label: 'Tháng 6', revenue: 610000000, profit: 183000000 }
    ];

    this.recentTransactions = [
      { code: 'INV-2024-001', customerName: 'Nguyễn Hoàng Long', totalAmount: 15500000, date: new Date().toISOString(), status: InvoiceStatus.Completed },
      { code: 'INV-2024-002', customerName: 'Trần Thị Mai Anh', totalAmount: 8200000, date: new Date().toISOString(), status: InvoiceStatus.Processing },
      { code: 'INV-2024-003', customerName: 'Phạm Minh Đức', totalAmount: 12450000, date: new Date().toISOString(), status: InvoiceStatus.Delivering },
      { code: 'INV-2024-004', customerName: 'Lê Thanh Hải', totalAmount: 3200000, date: new Date().toISOString(), status: InvoiceStatus.Completed },
      { code: 'INV-2024-005', customerName: 'Hoàng Gia Bảo', totalAmount: 4500000, date: new Date().toISOString(), status: InvoiceStatus.Canceled },
      { code: 'INV-2024-006', customerName: 'Đặng Thu Thảo', totalAmount: 21000000, date: new Date().toISOString(), status: InvoiceStatus.Completed },
      { code: 'INV-2024-007', customerName: 'Bùi Anh Tuấn', totalAmount: 5600000, date: new Date().toISOString(), status: InvoiceStatus.Processing }
    ];

    this.loading = false;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  }

  getStatusClass(status: string | number): string {
    const statusStr =
      typeof status === 'number'
        ? InvoiceStatus[status]
        : status;

    switch (statusStr) {
      case 'Confirmed':
      case 'Completed':
        return 'blue';

      case 'Processing':
        return 'yellow';

      case 'Delivering':
        return 'green';

      case 'Canceled':
        return 'red';

      default:
        return 'gray';
    }
  }

  getStatusText(status: string | number): string {
    const statusStr =
      typeof status === 'number'
        ? InvoiceStatus[status]
        : status;

    const statusMap: Record<string, string> = {
      Confirmed: 'Đã xác nhận',
      Processing: 'Đang xử lý',
      Delivering: 'Đang giao hàng',
      Completed: 'Hoàn thành',
      Canceled: 'Đã hủy'
    };

    return statusMap[statusStr] || statusStr;
  }

  trackByTransaction(index: number, item: TransactionItem): string {
    return item.code;
  }
}