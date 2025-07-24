import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WerdDto } from '../models/werd/werd.dto';
import { CreateWerdDto } from '../models/werd/create-werd.dto';
import { UpdateWerdDto } from '../models/werd/update-werd.dto';

@Injectable({
  providedIn: 'root',
})
export class WerdService {
  private readonly baseUrl = 'https://localhost:7026/api/werd';

  constructor(private http: HttpClient) {}

  getAll(): Observable<WerdDto[]> {
    return this.http.get<WerdDto[]>(this.baseUrl);
  }

  getById(id: number): Observable<WerdDto> {
    return this.http.get<WerdDto>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateWerdDto): Observable<WerdDto> {
    return this.http.post<WerdDto>(this.baseUrl, dto);
  }

  update(dto: UpdateWerdDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${dto.id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
