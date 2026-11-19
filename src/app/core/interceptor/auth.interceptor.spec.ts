import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { authInterceptor } from './auth.interceptor';
import { UserService } from '../service/user.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  // Faux serveur HTTP : il intercepte les requêtes au lieu de les envoyer au vrai back
  let httpMock: HttpTestingController;
  // Faux UserService : on décide nous-mêmes quel token est rangé
  const userServiceMock = { getToken: jest.fn(), logout: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('ajoute le header Authorization quand un token est rangé', () => {
    // GIVEN : l'utilisateur est connecté
    userServiceMock.getToken.mockReturnValue('fake-token');

    // WHEN : n'importe quelle requête part
    httpClient.get('/api/students').subscribe();

    // THEN : elle porte le header "Authorization: Bearer fake-token"
    const request = httpMock.expectOne('/api/students');
    expect(request.request.headers.get('Authorization')).toBe('Bearer fake-token');
    request.flush([]);
  });

  it('n\'ajoute pas de header quand aucun token n\'est rangé', () => {
    // GIVEN : l'utilisateur n'est pas connecté
    userServiceMock.getToken.mockReturnValue(null);

    // WHEN
    httpClient.post('/api/login', {}).subscribe();

    // THEN : la requête part sans header Authorization
    const request = httpMock.expectOne('/api/login');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });
});
