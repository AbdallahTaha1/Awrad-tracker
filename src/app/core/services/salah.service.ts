import { Injectable } from '@angular/core';
import { SalahWerdSubmission } from '../models/SalahWerdDtos/salah-werd-submission';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalahService {
  private baseUrl = 'https://localhost:7026/api/Salah';

  constructor(private http: HttpClient) {}

  getRecentSalahSubmissions(): Observable<SalahWerdSubmission[]> {
    return this.http.get<SalahWerdSubmission[]>(`${this.baseUrl}/recent`);
  }

  setSalahType(id: number, salahType: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/type/${id}`, { salahType });
  }

  setAzkar(id: number, azkar: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/azkar/${id}`, { azkar });
  }
}
