import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuranTrackingDto } from '../models/QuranTracking/quran-tracking-dto';
import { Observable } from 'rxjs';
import { CreateQuranTrackingDto } from '../models/QuranTracking/create-quran-tracking.dto';

@Injectable({
  providedIn: 'root',
})
export class QuranTrackingService {
  private apiUrl = 'https://localhost:7026/api/QuranTrackings';

  constructor(private http: HttpClient) {}

  addTracking(dto: CreateQuranTrackingDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, dto);
  }

  getTrackingById(id: number): Observable<QuranTrackingDto> {
    return this.http.get<QuranTrackingDto>(`/api/QuranTrackings/${id}`);
  }

  updateTracking(id: number, data: QuranTrackingDto): Observable<any> {
    return this.http.put(`/api/quran-tracking/${id}`, data);
  }

  getMyTrackings(referenceDate: Date): Observable<QuranTrackingDto[]> {
    const params = { referenceDate: referenceDate.toISOString() };
    return this.http.get<QuranTrackingDto[]>(`${this.apiUrl}/my`, { params });
  }

  update(id: number, dto: QuranTrackingDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
