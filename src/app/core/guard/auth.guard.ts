import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../service/user.service';

/**
 * Laisse passer vers l'écran demandé si l'utilisateur est connecté,
 * sinon le redirige vers la page de login.
 */
export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isLoggedIn()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
