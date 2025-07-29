import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';
import { Register } from '../models/authDtos/register.dto';
import { AuthResult } from '../models/authDtos/auth-result.dto';
import { Login } from '../models/authDtos/login.dto';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'https://awrad.runasp.net/api/Auth';

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
      const payload: any = jwtDecode(token);
      return payload['name'] || '';
    } catch (e) {
      console.error('فشل في قراءة التوكن:', e);
      return '';
    }
  }
}
