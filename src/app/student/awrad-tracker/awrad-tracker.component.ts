import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WerdSubmissionDto } from '../../core/models/werdSubmissionsDto/werd-submission.dto';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../layout/header/header.component';
import { WerdSubmissionService } from '../../core/services/werd-submission.service';

@Component({
  selector: 'app-awrad-tracker',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './awrad-tracker.component.html',
  styleUrls: ['./awrad-tracker.component.css'],
})
export class AwradTrackerComponent implements OnInit {
  werds: WerdSubmissionDto[] = [];
  werdsToday: WerdSubmissionDto[] = [];
  werdsYesterday: WerdSubmissionDto[] = [];
  loading = false;
  completionRate = 0;

  dates: string[] = [];
  groupedWerds: Record<string, WerdSubmissionDto[]> = {};

  selectedDate: string = '';

  errorMessage = '';

  constructor(private werdService: WerdSubmissionService) {}

  ngOnInit(): void {
    this.groupedWerds = {
      [this.todayString]: [],
      [this.yesterdayString]: [],
    };
    this.getRecentWerds();
  }

  getRecentWerds() {
    this.loading = true;
    this.werdService.getRecentSubmissions().subscribe({
      next: (submissions) => {
        this.groupedWerds = {};

        submissions.forEach((werd) => {
          const dateOnly = werd.date.split('T')[0];
          if (!this.groupedWerds[dateOnly]) {
            this.groupedWerds[dateOnly] = [];
          }
          this.groupedWerds[dateOnly].push(werd);
        });

        this.dates = Object.keys(this.groupedWerds).sort((a, b) =>
          b.localeCompare(a)
        );
        this.selectedDate = this.dates[0]; // افتراضيًا نعرض أحدث يوم

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading werds', err);
        this.loading = false;
      },
    });
  }

  markNotCompleted(id: number): void {
    this.werdService.markNotCompleted(id).subscribe({
      next: () => {
        for (let date in this.groupedWerds) {
          const target = this.groupedWerds[date].find((w) => w.id === id);
          if (target) {
            target.isCompleted = false;
            break;
          }
        }
      },
      error: (err) => {
        this.errorMessage = 'حدث خطأ أثناء التحديث.';
        console.error(err);
      },
    });
  }

  completeWerd(id: number): void {
    this.werdService.markCompleted(id).subscribe({
      next: () => {
        for (let date in this.groupedWerds) {
          const target = this.groupedWerds[date].find((w) => w.id === id);
          if (target) {
            target.isCompleted = true;
            break;
          }
        }
      },
      error: (err) => {
        this.errorMessage = 'حدث خطأ أثناء التحديث.';
        console.error(err);
      },
    });
  }

  getDayName(dateStr: string): string {
    const days = [
      'الأحد',
      'الإثنين',
      'الثلاثاء',
      'الأربعاء',
      'الخميس',
      'الجمعة',
      'السبت',
    ];
    const date = new Date(dateStr);
    return days[date.getDay()];
  }

  get todayString() {
    return new Date().toISOString().split('T')[0];
  }

  get yesterdayString() {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return y.toISOString().split('T')[0];
  }

  hasWerds(date: string): boolean {
    return (
      this.groupedWerds &&
      this.groupedWerds[date] &&
      this.groupedWerds[date].length > 0
    );
  }
}
