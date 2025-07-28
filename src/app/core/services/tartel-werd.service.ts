import { Injectable } from '@angular/core';
import { TartelWerd } from '../models/tartelWerdDtos/tartel-werd';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTartelWerd } from '../models/tartelWerdDtos/create-tartel-werd';

@Injectable({
  providedIn: 'root',
})
export class TartelWerdService {
  private apiUrl = 'https://localhost:7026/api/TartelWerd';

  constructor(private http: HttpClient) {}

  addWerd(dto: CreateTartelWerd): Observable<TartelWerd> {
    console.log(dto);
    return this.http.post<TartelWerd>(this.apiUrl, dto);
  }

  getWerdForWeek(startDate?: Date): Observable<TartelWerd[]> {
    if (startDate) {
      console.log('startDate');
      const formattedDate = startDate?.toISOString().split('T')[0];
      return this.http.get<TartelWerd[]>(
        `${this.apiUrl}?date=${formattedDate}`
      );
    } else {
      return this.http.get<TartelWerd[]>(this.apiUrl);
    }
  }

  getWerdById(id: number): Observable<TartelWerd> {
    return this.http.get<TartelWerd>(`${this.apiUrl}/${id}`);
  }

  update(id: number, dto: CreateTartelWerd): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
