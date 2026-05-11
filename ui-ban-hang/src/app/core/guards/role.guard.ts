import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[];
  const user = authService.currentUser();

  if (authService.isLoggedIn() && user) {
    if (!allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
      return true;
    }
  }

  // Not authorized or not logged in, redirect to admin login
  return router.createUrlTree(['/Operations/login']);
};
