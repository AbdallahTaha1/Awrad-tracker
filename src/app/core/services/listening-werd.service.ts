import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListeningWerdDto } from '../models/listeningWerdDtos/listening-werd-dto';
import { CreateListeningWerdDto } from '../models/listeningWerdDtos/create-listening-werd-dto';

@Injectable({
  providedIn: 'root',
})
export class ListeningWerdService {
  private apiUrl = 'https://awrad.runasp.net/api/ListeningWerds';

  constructor(private http: HttpClient) {}

  getMyWerds(startDate: Date): Observable<ListeningWerdDto[]> {
    console.log(startDate);
    const formattedDate = startDate.toISOString().split('T')[0]; // yyyy-MM-dd
    return this.http.get<ListeningWerdDto[]>(
      `${this.apiUrl}?date=${formattedDate}`
    );
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
