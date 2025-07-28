import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SalahWerdSubmission } from '../../core/models/salah-werd-submission';
import { SalahService } from '../../core/services/salah.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../layout/header/header.component';

@Component({
  selector: 'app-salah-tracker',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './salah-tracker.component.html',
  styleUrl: './salah-tracker.component.css',
})
export class SalahTrackerComponent implements OnInit {
  allSubmissions: SalahWerdSubmission[] = [];
  groupedSubmissions: Record<string, SalahWerdSubmission[]> = {};
  selectedTab: string = '';
  loading = true;

  todayStr = new Date().toISOString().slice(0, 10);
  yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  constructor(private salahService: SalahService) {}

  ngOnInit(): void {
    this.salahService.getRecentSalahSubmissions().subscribe({
      next: (data) => {
        this.allSubmissions = data;
        this.groupSubmissions();
        this.selectedTab = this.todayStr; // default to today
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  groupSubmissions() {
    this.groupedSubmissions = {
      [this.todayStr]: this.allSubmissions.filter(
        (s) => s.date.slice(0, 10) === this.todayStr
      ),
      [this.yesterdayStr]: this.allSubmissions.filter(
        (s) => s.date.slice(0, 10) === this.yesterdayStr
      ),
    };
  }

  getTabLabel(date: string): string {
    if (date === this.todayStr) return 'اليوم';
    if (date === this.yesterdayStr) return 'أمس';
    return date;
  }

  setSalahType(sub: SalahWerdSubmission, type: number) {
    sub.salahType = type;
    this.salahService.setSalahType(sub.id, type).subscribe({
      next: () => console.log('تم تحديث نوع الصلاة'),
      error: () => alert('حدث خطأ أثناء الحفظ'),
    });
  }

  setAzkar(sub: SalahWerdSubmission, azkar: boolean) {
    sub.azkar = azkar;
    this.salahService.setAzkar(sub.id, azkar).subscribe({
      next: () => console.log('تم تحديث الأذكار'),
      error: () => alert('حدث خطأ أثناء الحفظ'),
    });
  }
}
