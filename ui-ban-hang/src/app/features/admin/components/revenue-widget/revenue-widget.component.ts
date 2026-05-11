import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueStats } from '../../models/order-management.models';

@Component({
  selector: 'app-revenue-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="revenue-card">
      <p class="label">DOANH THU HÔM NAY</p>
      <h2 class="val">{{ stats.todayRevenue | number }}đ</h2>
      
      <div class="stats-row">
        <div class="stat">
          <p>Đơn mới</p>
          <h3>{{ stats.newOrdersCount }}</h3>
        </div>
        <div class="stat">
          <p>Tỷ lệ chuyển đổi</p>
          <h3 class="trend"><i class="ph ph-trend-up"></i> {{ stats.conversionRate }}%</h3>
        </div>
      </div>
    </div>
  `,
  styleUrl: './revenue-widget.component.scss'
})
export class RevenueWidgetComponent {
  @Input({ required: true }) stats!: RevenueStats;
}
