import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuranTrackingDto } from '../models/quranTrackingDtos/quran-tracking-dto';
import { Observable } from 'rxjs';
import { CreateQuranTrackingDto } from '../models/quranTrackingDtos/create-quran-tracking.dto';

@Injectable({
  providedIn: 'root',
})
export class QuranTrackingService {
  private apiUrl = 'https://awrad.runasp.net/api/QuranTrackings';

  constructor(private http: HttpClient) {}

  addTracking(dto: CreateQuranTrackingDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, dto);
  }

  getTrackingById(id: number): Observable<QuranTrackingDto> {
    return this.http.get<QuranTrackingDto>(`${this.apiUrl}/${id}`);
  }

  updateTracking(id: number, data: QuranTrackingDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  getMyTrackings(date: Date): Observable<QuranTrackingDto[]> {
    const params = { date: date.toISOString() };
    return this.http.get<QuranTrackingDto[]>(`${this.apiUrl}`, { params });
  }

  update(id: number, dto: QuranTrackingDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
