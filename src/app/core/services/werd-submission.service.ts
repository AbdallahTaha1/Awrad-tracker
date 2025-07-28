import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WerdSubmissionDto } from '../models/werdSubmissionsDto/werd-submission.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WerdSubmissionService {
  private readonly baseUrl = 'https://localhost:7026/api/Submissions';

  constructor(private http: HttpClient) {}

  /** Get today's submissions for the logged-in student */
  getToday(): Observable<WerdSubmissionDto[]> {
    return this.http.get<WerdSubmissionDto[]>(`${this.baseUrl}/today`);
  }

  getRecentSubmissions(): Observable<WerdSubmissionDto[]> {
    return this.http.get<WerdSubmissionDto[]>(`${this.baseUrl}/recent`);
  }

  /** Mark a submission as completed */
  markCompleted(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/complete/${id}`, {});
  }

  /** Mark a submission as completed */
  markNotCompleted(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/notCompleted/${id}`, {});
  }

  /** Get submission history for a specific date */
  getHistory(date: Date): Observable<WerdSubmissionDto[]> {
    const params = new HttpParams().set('date', date.toISOString());
    return this.http.get<WerdSubmissionDto[]>(`${this.baseUrl}/history`, {
      params,
    });
  }
}
