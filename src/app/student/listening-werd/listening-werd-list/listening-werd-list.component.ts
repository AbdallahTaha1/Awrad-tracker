import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { HeaderComponent } from '../../../layout/header/header.component';
import { ListeningWerdService } from '../../../core/services/listening-werd.service';
import { ListeningWerdDto } from '../../../core/models/listeningWerdDtos/listening-werd-dto';

@Component({
  selector: 'app-listening-werd-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, RouterModule],
  templateUrl: './listening-werd-list.component.html',
  styleUrl: './listening-werd-list.component.css',
})
export class ListeningWerdListComponent implements OnInit {
  werds: ListeningWerdDto[] = [];
  weekRangeText: string = '';
  currentWeekStart: Date = this.getStartOfWeek(new Date());
  loading: boolean = false;
  isCurrentWeek: boolean = true;

  constructor(
    private werdService: ListeningWerdService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateWeekText();
    this.loadThisWeekWerds();
  }

  // ======== التاريخ - تحديد بداية ونهاية الأسبوع ========

  /** يُرجع بداية الأسبوع (يوم السبت) */
  getStartOfWeek(date: Date): Date {
    const day = date.getDay(); // 0 = Sunday, ..., 6 = Saturday
    const diff = (day + 1) % 7; // Saturday (6) -> 0
    const start = new Date(date);
    start.setDate(date.getDate() - diff);
    start.setHours(3, 0, 0, 0); // تعيين الوقت إلى 03:00 صباحًا
    return start;
  }

  /** يُرجع نهاية الأسبوع بناءً على تاريخ البداية */
  getEndOfWeek(start: Date): Date {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  }

  /** تحديث نص نطاق الأسبوع (مثال: 27 يوليو - 2 أغسطس) */
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

  /** التحقق ما إذا كان الأسبوع المعروض هو الأسبوع الحالي */
  updateIsCurrentWeek(): void {
    const todayStart = this.getStartOfWeek(new Date());
    this.isCurrentWeek =
      this.currentWeekStart.toDateString() === todayStart.toDateString();
  }

  // ======== العمليات الرئيسية ========

  /** تحميل الأوراد الخاصة بالأسبوع الحالي */
  loadThisWeekWerds(): void {
    this.updateWeekText();
    this.updateIsCurrentWeek();

    this.werdService.getMyWerds(this.currentWeekStart).subscribe({
      next: (data) => (this.werds = data),
      error: (err) => console.error(err),
    });
  }

  /** التنقل إلى الأسبوع السابق */
  prevWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.loadThisWeekWerds();
  }

  /** التنقل إلى الأسبوع التالي (فقط إن لم يتجاوز التاريخ الحالي) */
  nextWeek(): void {
    const next = new Date(this.currentWeekStart);
    next.setDate(next.getDate() + 7);

    const today = new Date();
    if (next <= today) {
      this.currentWeekStart = next;
      this.loadThisWeekWerds();
    }
  }

  /** العودة إلى الأسبوع الحالي */
  goToCurrentWeek(): void {
    this.currentWeekStart = this.getStartOfWeek(new Date());
    this.loadThisWeekWerds();
  }

  // ======== إجراءات التعديل والحذف ========

  edit(id: number): void {
    this.router.navigate(['/student/listening/edit', id]);
  }

  delete(id: number): void {
    const confirmed = confirm('هل أنت متأكد أنك تريد حذف هذا الورد؟');
    if (!confirmed) return;

    this.werdService.delete(id).subscribe({
      next: () => this.loadThisWeekWerds(),
      error: (err) => console.error('Delete failed', err),
    });
  }
}
