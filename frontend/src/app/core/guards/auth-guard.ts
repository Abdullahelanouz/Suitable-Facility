import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn) {
      return router.createUrlTree(['/auth/login']);
    }

    if (allowedRoles.includes(auth.currentUser!.role)) {
      return true;
    }

    return router.createUrlTree(['/']);
  };
};

export const guestGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn) {
    return true;
  }

  // If logged in, redirect them to the appropriate page
  const role = auth.currentUser?.role;
  if (role === 'Admin') {
    return router.createUrlTree(['/admin']);
  } else if (role === 'Technician') {
    return router.createUrlTree(['/portugal/dashboard/tech']);
  } else {
    // Default for Client or any other role
    return router.createUrlTree(['/portugal/services']);
  }
};
