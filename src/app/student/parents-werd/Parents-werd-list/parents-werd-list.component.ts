import { Component } from '@angular/core';
import { ParentsWerd } from '../../../core/models/parentsWerdDtos/parents-werd';
import { ParentsWerdService } from '../../../core/services/parents-werd.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../layout/header/header.component';

@Component({
  selector: 'app-parents-werd-list',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './parents-werd-list.component.html',
  styleUrl: './parents-werd-list.component.css',
})
export class ParentsWerdListComponent {
  records: ParentsWerd[] = [];
  loading = false;
  currentWeekStart: Date = this.getStartOfWeek(new Date());
  isCurrentWeek: boolean = true;
  weekRangeText: string = '';

  constructor(
    private parentsWerdService: ParentsWerdService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateWeekText();

    this.loadWerds();
  }

  // ======== العمليات الرئيسية ========

  /** تحميل الأوراد الخاصة بالأسبوع الحالي */
  loadWerds() {
    this.loading = true;
    this.parentsWerdService
      .getParentsWerdForWeek(this.currentWeekStart)
      .subscribe({
        next: (data: ParentsWerd[]) => (this.records = data),
        error: () => alert('فشل في تحميل البيانات'),
        complete: () => (this.loading = false),
      });
  }

  /** التنقل إلى الأسبوع السابق */
  prevWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.loadWerds();
  }

  /** التنقل إلى الأسبوع التالي (فقط إن لم يتجاوز التاريخ الحالي) */
  nextWeek(): void {
    const next = new Date(this.currentWeekStart);
    next.setDate(next.getDate() + 7);

    const today = new Date();
    if (next <= today) {
      this.currentWeekStart = next;
      this.loadWerds();
    }
  }

  /** العودة إلى الأسبوع الحالي */
  goToCurrentWeek(): void {
    this.currentWeekStart = this.getStartOfWeek(new Date());
    this.loadWerds();
  }

  // ======== إجراءات التعديل والحذف ========

  edit(id: number): void {
    this.router.navigate(['/student/listening/edit', id]);
  }

  delete(id: number): void {
    const confirmed = confirm('هل أنت متأكد أنك تريد حذف هذا الورد؟');
    if (!confirmed) return;

    this.parentsWerdService.delete(id).subscribe({
      next: () => this.loadWerds(),
      error: (err) => console.error('Delete failed', err),
    });
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
}
