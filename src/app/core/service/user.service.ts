import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { Login } from '../models/Login';
import { LoginResponse } from '../models/LoginResponse';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
