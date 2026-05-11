import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent {
  constructor(public authService: AuthService) { }

  user = computed(() => this.authService.currentUser());

  role = computed(() => this.user()?.role);

  isAdmin = computed(() => this.role() === 'Admin');

  isSeller = computed(() => this.role() === 'Seller');

  isWarehouse = computed(() => this.role() === 'WarehouseManager');

  canSeeOrders = computed(() => {
    return ['Admin'].includes(this.role() ?? '');
  });

  canSeeProducts = computed(() => {
    return ['Admin', 'Seller', 'WarehouseManager'].includes(this.role() ?? '');
  });

  canSeeSuppliers = computed(() => {
    return ['Admin', 'WarehouseManager'].includes(this.role() ?? '');
  });

  canSeeApprovals = computed(() => {
    return ['Seller'].includes(this.role() ?? '');
  });

  canSeeReports = computed(() => {
    return ['Admin'].includes(this.role() ?? '');
  });

  canSeeUsers = computed(() => {
    return this.role() === 'Admin';
  });

  canSeeDashboard = computed(() => {
    return ['Admin'].includes(
      this.role() ?? ''
    );
  });
}