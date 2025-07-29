import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssignTeacherGroupDto } from '../models/assign-teacher-group.dto';
import { GroupDto } from '../models/groupDtos/Group.Dto';
import { CreateGroupDto } from '../models/groupDtos/create-group.dto';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private readonly baseUrl = 'https://awrad.runasp.net/api/groups';

  constructor(private http: HttpClient) {}

  getAll(): Observable<GroupDto[]> {
    return this.http.get<GroupDto[]>(this.baseUrl);
  }

  getById(id: number): Observable<GroupDto> {
    return this.http.get<GroupDto>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateGroupDto): Observable<GroupDto> {
    return this.http.post<GroupDto>(this.baseUrl, dto);
  }

  update(id: number, dto: CreateGroupDto): Observable<GroupDto> {
    return this.http.put<GroupDto>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
