import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuranTrackingService } from '../../../core/services/quran-tracking.service';
import { QuranTrackingDto } from '../../../core/models/QuranTracking/quran-tracking-dto';
import { HeaderComponent } from '../../../layout/header/header.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-quran-tracking-list',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  templateUrl: './quran-tracking-list.component.html',
  styleUrl: './quran-tracking-list.component.css',
})
export class QuranTrackingListComponent implements OnInit {
  records: QuranTrackingDto[] = [];
  currentWeekStart: Date = this.getStartOfWeek(new Date());
  weekRangeText: string = '';
  loading = false;
  isCurrentWeek = true;

  constructor(private service: QuranTrackingService, private router: Router) {}

  ngOnInit(): void {
    this.updateWeekText();
    this.loadThisWeekTrackings();
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay(); // Sunday = 0
    const diff = (day + 6) % 7; // يجعل السبت = 0
    const start = new Date(date);
    start.setDate(date.getDate() - diff);
    return start;
  }

  getEndOfWeek(start: Date): Date {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  }

  updateWeekText(): void {
    const start = this.currentWeekStart;
    const end = this.getEndOfWeek(start);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
    };
    this.weekRangeText = `${start.toLocaleDateString(
      'ar-EG',
      options
    )} - ${end.toLocaleDateString('ar-EG', options)}`;
  }

  updateIsCurrentWeek() {
    const todayStart = this.getStartOfWeek(new Date());
    this.isCurrentWeek =
      this.currentWeekStart.toDateString() === todayStart.toDateString();
  }

  loadThisWeekTrackings(): void {
    this.updateWeekText();
    this.updateIsCurrentWeek();
    this.loading = true;

    this.service.getMyTrackings(this.currentWeekStart).subscribe({
      next: (data) => {
        this.records = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('فشل تحميل تتبعات الأسبوع:', err);
        this.loading = false;
      },
    });
  }

  nextWeek(): void {
    const next = new Date(this.currentWeekStart);
    next.setDate(next.getDate() + 7);

    const today = new Date();
    if (next <= today) {
      this.currentWeekStart = next;
      this.updateIsCurrentWeek();
      this.loadThisWeekTrackings();
    }
  }

  previousWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.updateIsCurrentWeek();
    this.loadThisWeekTrackings();
  }

  backToCurrentWeek(): void {
    this.currentWeekStart = this.getStartOfWeek(new Date());
    this.updateIsCurrentWeek();
    this.loadThisWeekTrackings();
  }

  formatTrackingDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }

  onAdd(): void {
    this.router.navigate(['/student/quranTracking/add']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/student/quranTracking/edit', id]);
  }

  onDelete(id: number): void {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا التتبع؟')) {
      this.service.delete(id).subscribe({
        next: () => this.loadThisWeekTrackings(),
        error: (err) => console.error('Delete failed', err),
      });
    }
  }
}
