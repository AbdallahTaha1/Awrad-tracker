import { Component } from '@angular/core';
import { TartelWerd } from '../../../core/models/tartelWerdDtos/tartel-werd';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TartelWerdService } from '../../../core/services/tartel-werd.service';
import { HeaderComponent } from '../../../layout/header/header.component';

@Component({
  selector: 'app-tartel-werd-list',
  imports: [CommonModule, RouterModule, HeaderComponent],
  providers: [DatePipe],
  templateUrl: './tartel-werd-list.component.html',
  styleUrl: './tartel-werd-list.component.css',
})
export class TartelWerdListComponent {
  werds: TartelWerd[] = [];
  loading = false;

  weekStart!: Date;
  weekEnd!: Date;
  weekRangeText = '';

  currentWeekStart: Date = this.getStartOfWeek(new Date());
  isCurrentWeek = true;

  constructor(
    private tartelWerdService: TartelWerdService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateWeekText();
    this.loadThisWeekTrackings();
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
  loadThisWeekTrackings(): void {
    this.updateWeekText();
    this.updateIsCurrentWeek();
    this.loading = true;

    this.tartelWerdService.getWerdForWeek(this.currentWeekStart).subscribe({
      next: (data) => {
        console.log(data);
        this.werds = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('فشل تحميل تتبعات الأسبوع:', err);
        this.loading = false;
      },
    });
  }

  /** التنقل إلى الأسبوع السابق */
  prevWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.loadThisWeekTrackings();
  }

  /** التنقل إلى الأسبوع التالي (فقط إن لم يتجاوز التاريخ الحالي) */
  nextWeek(): void {
    const next = new Date(this.currentWeekStart);
    next.setDate(next.getDate() + 7);

    const today = new Date();
    if (next <= today) {
      this.currentWeekStart = next;
      this.loadThisWeekTrackings();
    }
  }

  /** العودة إلى الأسبوع الحالي */
  goToCurrentWeek(): void {
    this.currentWeekStart = this.getStartOfWeek(new Date());
    this.loadThisWeekTrackings();
  }

  // ======== إجراءات التعديل والحذف ========
  onAdd() {
    this.router.navigate(['/student/tartel/add']);
  }
  edit(id: number): void {
    this.router.navigate(['/student/tartel/edit', id]);
  }

  delete(id: number): void {
    const confirmed = confirm('هل أنت متأكد أنك تريد حذف هذا الورد؟');
    if (!confirmed) return;

    this.tartelWerdService.delete(id).subscribe({
      next: () => this.loadThisWeekTrackings(),
      error: (err) => console.error('Delete failed', err),
    });
  }
}
