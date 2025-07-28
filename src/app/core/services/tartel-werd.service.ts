import { Injectable } from '@angular/core';
import { TartelWerd } from '../models/TartelWerd/tartel-werd';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTartelWerd } from '../models/TartelWerd/create-tartel-werd';

@Injectable({
  providedIn: 'root',
})
export class TartelWerdService {
  private apiUrl = 'https://localhost:7026/api/TartelWerd';

  constructor(private http: HttpClient) {}

  addWerd(dto: CreateTartelWerd): Observable<TartelWerd> {
    return this.http.post<TartelWerd>(`${this.apiUrl}`, dto);
  }

  getThisWeek(): Observable<TartelWerd[]> {
    return this.http.get<TartelWerd[]>(`${this.apiUrl}/ThisWeek`);
  }

  update(id: number, dto: CreateTartelWerd): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
