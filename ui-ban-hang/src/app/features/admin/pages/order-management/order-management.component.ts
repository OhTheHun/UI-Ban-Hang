import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceAdminService, GenericInvoice } from '../../services/invoice-admin.service';
import { OrderListComponent } from '../../components/order-list/order-list.component';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, OrderListComponent],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.scss'
})
export class OrderManagementComponent {
  // Data State
  allOrders: GenericInvoice[] = [];
  orders: GenericInvoice[] = [];
  loading = false;
  pageSize = 6;

  currentPage = 1;
  currentStatus = -1;

  constructor(
    private invoiceService: InvoiceAdminService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadInvoices();
  }

  loadInvoices() {
    this.loading = true;
    this.invoiceService.getAllInvoices().subscribe({
      next: (data) => {
        this.allOrders = data;
        this.updatePagedOrders();
        this.loading = false;
        this.cdr.detectChanges(); // Force update if needed
      },
      error: (err) => {
        console.error('Failed to load invoices:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updatePagedOrders() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.orders = this.allOrders.slice(startIndex, startIndex + this.pageSize);
  }

  filterByStatus(status: number) {
    this.currentStatus = status;
    this.loading = true;
    this.currentPage = 1; // Reset to first page on filter

    if (status === -1) {
      this.loadInvoices();
      return;
    }
    
    this.invoiceService.filterInvoices(status).subscribe({
      next: (data) => {
        this.allOrders = data;
        this.updatePagedOrders();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to filter invoices:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onPageChanged(page: number) {
    const totalPages = Math.ceil(this.allOrders.length / this.pageSize);
    if (page > 0 && page <= totalPages) {
      this.currentPage = page;
      this.updatePagedOrders();
      this.cdr.detectChanges();
    }
  }
}
