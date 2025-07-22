import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const expectedRoles = route.data['roles'] as string[];
  const currentRole = authService.getRole();

  if(expectedRoles && expectedRoles.includes(currentRole || '')) {
    return true;
  }
  
  return router.parseUrl('/home');
};
