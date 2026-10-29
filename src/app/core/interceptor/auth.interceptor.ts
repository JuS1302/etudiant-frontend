import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { UserService } from '../service/user.service';

/**
 * Ajoute "Authorization: Bearer <token>" à chaque requête envoyée au back, si l'utilisateur est connecté.
 * Si le back répond 401 (token absent, faux ou expiré), supprime le token et renvoie vers /login.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const token = userService.getToken();

  const authRequest = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // On ignore /api/login : un 401 y veut dire « mauvais mot de passe », géré par l'écran de connexion.
      if (error.status === 401 && !request.url.includes('/api/login')) {
        userService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
