import { Component } from '@angular/core';
import { QuranTrackingDto } from '../../../core/models/quran-tracking-dto';
import { QuranTrackingService } from '../../../core/services/quran-tracking.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-quran-tracking-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quran-tracking-list.component.html',
  styleUrl: './quran-tracking-list.component.css',
})
export class QuranTrackingListComponent {
  trackings: QuranTrackingDto[] = [];

  constructor(private service: QuranTrackingService) {}

  ngOnInit(): void {
    this.service.getMyTrackings().subscribe({
      next: (data) => (this.trackings = data),
    });
  }
}
