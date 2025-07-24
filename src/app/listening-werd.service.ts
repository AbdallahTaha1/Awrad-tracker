import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListeningWerdDto } from './core/models/listeningWerd/listening-werd-dto';
import { Observable } from 'rxjs';
import { CreateListeningWerdDto } from './core/models/listeningWerd/create-listening-werd-dto';

@Injectable({
  providedIn: 'root',
})
export class ListeningWerdService {
  private apiUrl = 'https://localhost:7026/api/ListeningWerds';

  constructor(private http: HttpClient) {}

  getMyWerds(): Observable<ListeningWerdDto[]> {
    return this.http.get<ListeningWerdDto[]>(`${this.apiUrl}/my`);
  }

  getById(id: number): Observable<ListeningWerdDto> {
    return this.http.get<ListeningWerdDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateListeningWerdDto): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  update(id: number, dto: CreateListeningWerdDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
