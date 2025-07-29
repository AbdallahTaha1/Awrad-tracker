import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeacherDto } from '../models/teacherDtos/teacher.dto';
import { teacherWithGroups } from '../models/teacherDtos/teacherWithGroups';
import { AssignTeacherGroupDto } from '../models/assign-teacher-group.dto';

export interface TeacherGroupView {
  groupId: number;
  groupName: string;
  students: {
    id: number;
    fullName: string;
    email: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private readonly baseUrl = 'http://awrad.runasp.net/api/Teachers';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TeacherDto[]> {
    return this.http.get<TeacherDto[]>(this.baseUrl);
  }
  getMyStudents(): Observable<TeacherGroupView[]> {
    return this.http.get<TeacherGroupView[]>(`${this.baseUrl}/my-students`);
  }

  getAllWithGroups(): Observable<teacherWithGroups[]> {
    return this.http.get<teacherWithGroups[]>(
      `${this.baseUrl}/TecherWihtGroups`
    );
  }

  assignToGroup(assignGroupDto: AssignTeacherGroupDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/assign-group`, assignGroupDto);
  }

  removeFromGroup(assignGroupDto: AssignTeacherGroupDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/remove-group`, assignGroupDto);
  }
}
