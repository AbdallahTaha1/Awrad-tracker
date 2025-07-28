import { Injectable } from '@angular/core';
import { CreateParentsWerd } from '../models/parentsWerdDtos/create-parents-werd';
import { HttpClient } from '@angular/common/http';
import { ParentsWerd } from '../models/parentsWerdDtos/parents-werd';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParentsWerdService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'https://localhost:7026/api/ParentsWerd';

  Create(createParentsWerd: CreateParentsWerd): Observable<ParentsWerd> {
    return this.http.post<ParentsWerd>(this.apiUrl, createParentsWerd);
  }

  getParentsWerdForWeek(startDate?: Date): Observable<ParentsWerd[]> {
    if (startDate) {
      const formattedDate = startDate?.toISOString().split('T')[0];
      return this.http.get<ParentsWerd[]>(
        `${this.apiUrl}?date=${formattedDate}`
      );
    } else {
      return this.http.get<ParentsWerd[]>(this.apiUrl);
    }
  }

  update(id: number, dto: CreateParentsWerd): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
