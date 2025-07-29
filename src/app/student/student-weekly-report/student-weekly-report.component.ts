import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header.component';
import { WeeklyReport } from '../../core/models/weekly-report.dto';
import { StudentService } from '../../core/services/student.service';

@Component({
  selector: 'app-student-weekly-report',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './student-weekly-report.component.html',
  styleUrls: ['./student-weekly-report.component.css'],
})
export class StudentWeeklyReportComponent implements OnInit {
  report: WeeklyReport | null = null;
  currentFriday: Date = this.getLastFriday(new Date());
  studentId: number | null = null;
  canGoForward = false;

  constructor(
    private studentService: StudentService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.queryParamMap.get('studentId');
    this.studentId = idParam ? +idParam : null;

    this.loadReport();
  }

  loadReport(): void {
    const start = new Date(this.currentFriday);
    const end = new Date(this.currentFriday);
    end.setDate(start.getDate() + 6); // الجمعة إلى الخميس

    const startParam = start.toISOString().split('T')[0];
    const endParam = end.toISOString().split('T')[0];

    this.studentService.getWeeklyReport(startParam, endParam).subscribe({
      next: (data) => {
        this.report = data;
        this.checkCanGoForward();
      },
      error: (err) => {
        console.error('Failed to load report', err);
        this.report = null;
      },
    });
  }

  goToPreviousWeek(): void {
    this.currentFriday.setDate(this.currentFriday.getDate() - 7);
    this.loadReport();
  }

  goToNextWeek(): void {
    this.currentFriday.setDate(this.currentFriday.getDate() + 7);
    this.loadReport();
  }

  checkCanGoForward(): void {
    const today = new Date();
    const nextFriday = new Date(this.currentFriday);
    nextFriday.setDate(nextFriday.getDate() + 7);
    this.canGoForward = nextFriday <= today;
  }

  getLastFriday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sunday, ..., 5 = Friday
    const diff = (day + 1) % 7; // days since last Friday
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  getCompletionPercentage(item: any): number {
    if (!item.totalSubmissions) return 0;
    return (item.completedCount / item.totalSubmissions) * 100;
  }

  getScorePercentage(item: any): number {
    if (!item.maxPossibleScore) return 0;
    return (item.totalScore / item.maxPossibleScore) * 100;
  }
}
