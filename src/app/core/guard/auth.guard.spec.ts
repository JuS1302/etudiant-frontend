import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { authGuard } from './auth.guard';
import { UserService } from '../service/user.service';

describe('authGuard', () => {
  // Faux UserService : on décide nous-mêmes si l'utilisateur est connecté ou non
  const userServiceMock = { isLoggedIn: jest.fn() };

  /**
   * Exécute le guard comme le ferait Angular avant d'afficher une route.
   */
  const runGuard = () => TestBed.runInInjectionContext(
    () => authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
      ]
    });
  });

  it('laisse passer quand l\'utilisateur est connecté', () => {
    // GIVEN
    userServiceMock.isLoggedIn.mockReturnValue(true);

    // THEN
    expect(runGuard()).toBe(true);
  });

  it('renvoie vers /login quand l\'utilisateur n\'est pas connecté', () => {
    // GIVEN
    userServiceMock.isLoggedIn.mockReturnValue(false);

    // WHEN
    const result = runGuard() as UrlTree;

    // THEN : le guard renvoie l'adresse /login au lieu de laisser passer
    const router = TestBed.inject(Router);
    expect(router.serializeUrl(result)).toBe('/login');
  });
});
