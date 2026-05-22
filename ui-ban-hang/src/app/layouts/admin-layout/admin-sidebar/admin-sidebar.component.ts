import { Component, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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
  constructor(public authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logoutOnly();
    this.router.navigate(['/Operations/login']);
  }

  user = computed(() => this.authService.currentUser());

  role = computed(() => this.user()?.role);

  isAdmin = computed(() => this.role() === 'Admin');

  isSeller = computed(() => this.role() === 'Seller');

  isWarehouse = computed(() => this.role() === 'WareHouseManager');

  canSeeOrders = computed(() => {
    return ['Admin'].includes(this.role() ?? '');
  });

  canSeeProducts = computed(() => {
    return ['WareHouseManager'].includes(this.role() ?? '');
  });

  canSeeSuppliers = computed(() => {
    return ['Admin', 'WareHouseManager'].includes(this.role() ?? '');
  });

  canSeeApprovals = computed(() => {
    return ['Seller'].includes(this.role() ?? '');
  });

  canSeeReports = computed(() => {
    return ['Admin'].includes(this.role() ?? '');
  });

  canSeeImports = computed(() => {
    return ['Admin', 'WareHouseManager'].includes(this.role() ?? '');
  });

  canSeeUsers = computed(() => {
    return ['Admin', 'HR'].includes(this.role() ?? '');
  });

  canSeeDashboard = computed(() => {
    return ['Admin'].includes(
      this.role() ?? ''
    );
  });
}
