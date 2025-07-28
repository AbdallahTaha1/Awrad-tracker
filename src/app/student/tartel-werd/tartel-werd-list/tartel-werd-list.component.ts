import { Component } from '@angular/core';
import { TartelWerd } from '../../../core/models/TartelWerd/tartel-werd';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  constructor(
    private tartelWerdService: TartelWerdService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.setWeekDates();
    this.loadWerds();
  }

  loadWerds(): void {
    this.loading = true;
    this.tartelWerdService.getThisWeek().subscribe({
      next: (data) => {
        this.werds = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  setWeekDates() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const diffToSaturday = (7 + dayOfWeek - 6) % 7;

    this.weekStart = new Date(today);
    this.weekStart.setDate(today.getDate() - diffToSaturday);

    this.weekEnd = new Date(this.weekStart);
    this.weekEnd.setDate(this.weekStart.getDate() + 6);

    const startText = this.datePipe.transform(
      this.weekStart,
      'fullDate',
      '',
      'ar-EG'
    );
    const endText = this.datePipe.transform(
      this.weekEnd,
      'fullDate',
      '',
      'ar-EG'
    );
    this.weekRangeText = `من ${startText} إلى ${endText}`;
  }

  deleteWerd(id: number) {
    if (!confirm('هل أنت متأكد من حذف هذا الورد؟')) return;
    // لاحقًا: نفذ خدمة الحذف من السيرفر
    this.werds = this.werds.filter((w) => w.id !== id);
  }

  startEdit(id: number) {
    alert('سيتم فتح نموذج التعديل لهذا الورد (لم يتم تنفيذه بعد)');
  }
}
