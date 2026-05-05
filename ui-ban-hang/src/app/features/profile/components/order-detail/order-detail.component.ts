import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetail } from '../../models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent {
  @Input() order!: OrderDetail;
  @Output() onClose = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<string>();

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
      'confirmed': 'Đã đặt hàng',
      'processing': 'Đang xử lý',
      'delivering': 'Đang giao',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return map[s] || status;
  }

  canCancel(status: string): boolean {
    const s = status?.toLowerCase() || '';
    return s === 'confirmed' || s === 'processing';
  }

  // 🕒 Timeline Logic
  getTimelineSteps() {
    return [
      { label: 'Đã đặt hàng', status: 'completed', icon: 'ph-check-circle' },
      { label: 'Đang xử lý', status: this.getStepStatus('processing'), icon: 'ph-package' },
      { label: 'Đang giao hàng', status: this.getStepStatus('shipping'), icon: 'ph-truck' },
      { label: 'Hoàn thành', status: this.getStepStatus('delivered'), icon: 'ph-flag-pennant' }
    ];
  }

  private getStepStatus(step: string): 'pending' | 'active' | 'completed' {
    const s = this.order.status.toLowerCase();
    
    // Normalize status names (Handle both backend styles)
    let current = s;
    if (s === 'delivering') current = 'shipping';
    if (s === 'completed') current = 'delivered';

    if (current === 'cancelled') return 'pending';
    
    const sequence = ['pending', 'processing', 'shipping', 'delivered'];
    const currentIndex = sequence.indexOf(current);
    const stepIndex = sequence.indexOf(step);

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  }

  printInvoice(): void {
    window.print();
  }
}
