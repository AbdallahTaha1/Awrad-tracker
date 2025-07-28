import { Component } from '@angular/core';
import { ParentsWerd } from '../../../core/models/parents-werd';
import { ParentsWerdService } from '../../../core/services/parents-werd.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  constructor(private parentsWerdService: ParentsWerdService) {}

  ngOnInit(): void {
    this.updateWeekText();

    this.fetchRecords();
  }

  fetchRecords() {
    this.loading = true;
    this.parentsWerdService.getParentsWerdThisWeek().subscribe({
      next: (data: ParentsWerd[]) => (this.records = data),
      error: () => alert('فشل في تحميل البيانات'),
      complete: () => (this.loading = false),
    });
  }

  currentWeekStart: Date = this.getStartOfWeek(new Date());
  weekRangeText: string = '';

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  updateWeekText() {
    const start = new Date(this.currentWeekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const options = { day: 'numeric', month: 'long', year: 'numeric' } as const;
    this.weekRangeText = `${start.toLocaleDateString(
      'ar-EG',
      options
    )} - ${end.toLocaleDateString('ar-EG', options)}`;
  }

  goToPreviousWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.updateWeekText();
    this.loadWerds();
  }

  goToNextWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.updateWeekText();
    this.loadWerds();
  }

  loadWerds() {
    // قم بتحميل الأوراد بناءً على currentWeekStart و currentWeekEnd
    // مثال:
    // this.service.getParentsWerdsInWeek(this.currentWeekStart, endDate).subscribe(...)
  }
}
