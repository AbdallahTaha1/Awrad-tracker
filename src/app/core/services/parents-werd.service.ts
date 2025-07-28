import { Injectable } from '@angular/core';
import { CreateParentsWerd } from '../models/create-parents-werd';
import { HttpClient } from '@angular/common/http';
import { ParentsWerd } from '../models/parents-werd';
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

  getParentsWerdThisWeek(): Observable<ParentsWerd[]> {
    return this.http.get<ParentsWerd[]>(`${this.apiUrl}/ThisWeek`);
  }

  update(id: number, dto: CreateParentsWerd): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
