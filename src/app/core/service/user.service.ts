import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { Login } from '../models/Login';
import { LoginResponse } from '../models/LoginResponse';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }

  register(user: Register): Observable<Object> {
    return this.httpClient.post('/api/register', user);
  }

  /**
   * Envoie le login et le mot de passe au back-end, qui renvoie un token JWT.
   */
  login(credentials: Login): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>('/api/login', credentials);
  }

  /**
   * Range le token reçu au login dans le navigateur.
   */
  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Renvoie le token rangé, ou null si l'utilisateur n'est pas connecté.
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Indique si l'utilisateur est connecté (s'il a un token).
   */
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Déconnecte l'utilisateur en supprimant son token.
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
