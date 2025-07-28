import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentDto } from '../models/studentDtos/Student.dto';
import { AssignTeacherGroupDto } from '../models/assign-teacher-group.dto';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly baseUrl = 'https://localhost:7026/api/Students';

  constructor(private http: HttpClient) {}

  // Get all students
  getAllStudents(): Observable<StudentDto[]> {
    return this.http.get<StudentDto[]>(this.baseUrl);
  }

  getAllWithGroup(): Observable<StudentDto[]> {
    return this.http.get<StudentDto[]>(`${this.baseUrl}/with-group`);
  }

  getWeeklyReport(): Observable<any> {
    return this.http.get(`${this.baseUrl}/weekly-report`);
  }

  assignToGroup(studentId: string, groupId: number) {
    return this.http.put(`${this.baseUrl}/assign-group/${studentId}`, {
      groupId,
    });
  }

  removeFromGroup(dto: AssignTeacherGroupDto) {
    return this.http.post(`${this.baseUrl}/remove-group`, dto);
  }
}
