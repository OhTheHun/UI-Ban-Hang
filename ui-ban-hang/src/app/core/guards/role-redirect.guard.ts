import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

const ROLE_DEFAULT_ROUTES: Record<string, string> = {
  Admin: '/Operations/dashboard',
  Seller: '/Operations/approvals',
  WareHouseManager: '/Operations/products',
  HR: '/Operations/staff',
};

export const roleRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  if (!user) return router.createUrlTree(['/Operations/login']);

  const target = ROLE_DEFAULT_ROUTES[user.role] ?? '/Operations/products';
  return router.createUrlTree([target]);
};
