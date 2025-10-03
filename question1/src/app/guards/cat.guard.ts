import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../user.service';
import { inject } from '@angular/core';

export const catGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.currentUser?.prefercat) {
    return router.createUrlTree(['/dog'])
  }

  return true;
};
