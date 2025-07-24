import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';
import { Register } from '../models/auth/register.dto';
import { AuthResult } from '../models/auth/auth-result.dto';
import { Login } from '../models/auth/login.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'https://localhost:7026/api/Auth';

  constructor(private http: HttpClient) {}

  register(data: Register): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${this.API_URL}/register`, data);
  }

  login(credentials: Login) {
    return this.http.post<AuthResult>(this.API_URL, credentials);
  }

  getUserRoles(): string[] {
    const roles = localStorage.getItem('userRole');
    return roles ? JSON.parse(roles) : [];
  }

  saveAuthData(token: string, roles: string[]) {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', JSON.stringify(roles));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserName(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      return (
        payload['name'] ||
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        ''
      );
    } catch (e) {
      console.error('خطأ في فك التوكن:', e);
      return '';
    }
  }
}
