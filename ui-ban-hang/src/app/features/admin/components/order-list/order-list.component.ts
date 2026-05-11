import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent {
  @Input({ required: true }) orders: any[] = [];
  @Input() loading: boolean = false;
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 6;
  @Output() onPageChange = new EventEmitter<number>();

  activeDropdownId: string | null = null;
  showColumnSelector = false;
  dropdownPosition = { top: '0px', left: '0px' };

  columnConfig = [
    { key: 'invoiceId', label: 'Invoice ID', visible: true },
    { key: 'code', label: 'Order Code', visible: true },
    { key: 'user', label: 'User', visible: true },
    { key: 'contact', label: 'Contact', visible: true },
    { key: 'address', label: 'Address', visible: true },
    { key: 'amount', label: 'Amount', visible: true },
    { key: 'method', label: 'Method', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'date', label: 'Date', visible: true }
  ];

  constructor(
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  toggleDropdown(event: MouseEvent, invoiceId: string) {
    event.preventDefault();
    event.stopPropagation();
    
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    
    // Get the nearest relative container to calculate offset
    const container = button.closest('.main-content') as HTMLElement;
    const containerRect = container.getBoundingClientRect();
    
    this.dropdownPosition = {
      top: `${rect.bottom - containerRect.top + 5}px`,
      left: `${rect.left - containerRect.left - 130}px`
    };

    if (this.activeDropdownId === invoiceId) {
      this.activeDropdownId = null;
    } else {
      this.activeDropdownId = invoiceId;
    }
    this.cdr.detectChanges();
  }

  copyInvoiceId(invoiceId: string) {
    navigator.clipboard.writeText(invoiceId).then(() => {
      this.toast.success('Đã sao chép Invoice ID!');
      this.activeDropdownId = null;
      this.cdr.detectChanges();
    });
  }

  viewDetail(invoiceId: string) {
    this.toast.info('Đang mở chi tiết hóa đơn: ' + invoiceId);
    this.activeDropdownId = null;
    this.cdr.detectChanges();
  }

  hostClick() {
    if (this.activeDropdownId || this.showColumnSelector) {
      this.activeDropdownId = null;
      this.showColumnSelector = false;
      this.cdr.detectChanges();
    }
  }

  toggleColumnSelector(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.showColumnSelector = !this.showColumnSelector;
    this.cdr.detectChanges();
  }

  toggleColumn(key: string) {
    const col = this.columnConfig.find(c => c.key === key);
    if (col) {
      col.visible = !col.visible;
      this.cdr.detectChanges();
    }
  }

  isColumnVisible(key: string): boolean {
    return this.columnConfig.find(c => c.key === key)?.visible ?? true;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }
}
