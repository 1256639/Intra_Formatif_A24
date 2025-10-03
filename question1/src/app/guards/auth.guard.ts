import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../user.service';

export const authGuard: CanActivateFn = (route, state) => {
  
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.currentUser) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
