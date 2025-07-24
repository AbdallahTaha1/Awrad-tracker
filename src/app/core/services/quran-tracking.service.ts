import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuranTrackingDto } from '../models/quran-tracking-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuranTrackingService {
  private api = 'https://localhost:7026/api/QuranTrackings';

  constructor(private http: HttpClient) {}

  addTracking(dto: QuranTrackingDto): Observable<any> {
    return this.http.post(`${this.api}`, dto);
  }

  getMyTrackings(): Observable<QuranTrackingDto[]> {
    return this.http.get<QuranTrackingDto[]>(`${this.api}/my`);
  }
}
