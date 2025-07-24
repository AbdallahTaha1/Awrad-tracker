import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as string[];
  const isAuthenticated = auth.isAuthenticated();

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  const userRoles = auth.getUserRoles(); // string[]

  const hasRole = expectedRoles.some((role) => userRoles.includes(role));

  if (hasRole) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};
