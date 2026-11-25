import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { Register } from '../models/Register';
import { Login } from '../models/Login';

describe('UserService', () => {
  let service: UserService;
  // Faux serveur HTTP : il intercepte les requêtes au lieu de les envoyer au vrai back
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    // Vérifie qu'aucune requête inattendue n'est restée sans réponse
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('register() envoie l\'agent en POST sur /api/register', () => {
    // GIVEN
    const agent: Register = { firstName: 'John', lastName: 'Doe', login: 'john', password: 'secret' };

    // WHEN
    service.register(agent).subscribe();

    // THEN : une seule requête POST vers /api/register, avec l'agent dans le body
    const request = httpMock.expectOne('/api/register');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(agent);
    request.flush({});
  });

  it('login() envoie les identifiants et renvoie le token reçu', () => {
    // GIVEN
    const credentials: Login = { login: 'john', password: 'secret' };
    let receivedToken: string | undefined;

    // WHEN
    service.login(credentials).subscribe(loginResponse => receivedToken = loginResponse.token);

    // THEN : POST sur /api/login, et le token de la réponse est bien transmis
    const request = httpMock.expectOne('/api/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(credentials);
    request.flush({ token: 'fake-token' });
    expect(receivedToken).toBe('fake-token');
  });

  it('saveToken() range le token, que getToken() retrouve', () => {
    // WHEN
    service.saveToken('fake-token');

    // THEN
    expect(service.getToken()).toBe('fake-token');
  });

  it('isLoggedIn() renvoie true quand un token est rangé', () => {
    // GIVEN
    service.saveToken('fake-token');

    // THEN
    expect(service.isLoggedIn()).toBe(true);
  });

  it('isLoggedIn() renvoie false quand aucun token n\'est rangé', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('logout() supprime le token', () => {
    // GIVEN
    service.saveToken('fake-token');

    // WHEN
    service.logout();

    // THEN
    expect(service.getToken()).toBeNull();
  });
});
