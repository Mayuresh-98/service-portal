import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as string[];
  const currentRole = localStorage.getItem('role');

  if(expectedRoles && expectedRoles.includes(currentRole || '')) {
    return true;
  }
  
  return router.parseUrl('/user/submit-request');
};
