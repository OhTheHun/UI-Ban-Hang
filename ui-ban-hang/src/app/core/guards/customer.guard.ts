import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const customerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (user) {
    const managementRoles = ['Admin', 'Seller', 'WareHouseManager', 'HR'];
    if (managementRoles.includes(user.role)) {
      // Redirect admins to admin dashboard
      return router.createUrlTree(['/Operations']);
    }
  }

  return true; // Allow guests and customers
};
