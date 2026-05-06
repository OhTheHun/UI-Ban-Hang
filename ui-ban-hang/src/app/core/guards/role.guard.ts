import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'];

  if (authService.isLoggedIn() && authService.hasRole(expectedRole)) {
    return true;
  }

  // Not authorized or not logged in, redirect to home or login
  return router.createUrlTree(['/']);
};
