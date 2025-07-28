import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../layout/header/header.component';
import { ListeningWerdDto } from '../../../core/models/listeningWerd/listening-werd-dto';
import { Router, RouterModule } from '@angular/router';
import { ListeningWerdService } from '../../../core/services/listening-werd.service';

@Component({
  selector: 'app-listening-werd-list',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, RouterModule],
  templateUrl: './listening-werd-list.component.html',
  styleUrl: './listening-werd-list.component.css',
})
export class ListeningWerdListComponent implements OnInit {
  werds: ListeningWerdDto[] = [];
  weekRangeText: string = '';
  currentWeekStart: Date = this.getStartOfWeek(new Date());
  loading = false;
  isCurrentWeek: boolean = true;

  constructor(
    private werdService: ListeningWerdService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateWeekText();
    this.loadThisWeekWerds();
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay(); // 0 = Sunday, ..., 6 = Saturday
    const diff = (day + 1) % 7; // 6 (Saturday) -> 0, 0 (Sunday) -> 1, ..., 5 (Friday) -> 6
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

  loadThisWeekWerds(): void {
    this.updateWeekText();
    this.updateIsCurrentWeek();

    this.werdService.getMyWerds(this.currentWeekStart).subscribe({
      next: (data) => (this.werds = data),
      error: (err) => console.error(err),
    });
  }

  edit(id: number) {
    this.router.navigate(['/student/listening/edit', id]);
  }

  delete(id: number) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا الورد؟')) {
      this.werdService.delete(id).subscribe({
        next: () => this.loadThisWeekWerds(),
        error: (err) => console.error('Delete failed', err),
      });
    }
  }

  updateIsCurrentWeek() {
    const todayStart = this.getStartOfWeek(new Date());
    this.isCurrentWeek =
      this.currentWeekStart.toDateString() === todayStart.toDateString();
  }

  goToCurrentWeek() {
    this.currentWeekStart = this.getStartOfWeek(new Date());
    this.updateWeekText();
    this.loadThisWeekWerds();
  }

  nextWeek(): void {
    const next = new Date(this.currentWeekStart);
    next.setDate(next.getDate() + 7);

    const today = new Date();
    if (next <= today) {
      this.currentWeekStart = next;
      this.updateIsCurrentWeek();
      this.loadThisWeekWerds();
    }
  }

  prevWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.updateIsCurrentWeek();
    this.loadThisWeekWerds();
  }
}
