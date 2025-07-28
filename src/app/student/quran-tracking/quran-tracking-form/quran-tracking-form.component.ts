import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuranTrackingService } from '../../../core/services/quran-tracking.service';
import { HeaderComponent } from '../../../layout/header/header.component';

@Component({
  selector: 'app-quran-tracking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './quran-tracking-form.component.html',
  styleUrl: './quran-tracking-form.component.css',
})
export class QuranTrackingFormComponent implements OnInit {
  form!: FormGroup;
  message = '';
  isEditMode = false;
  trackingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: QuranTrackingService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      date: ['', Validators.required],
      memorizationStartSurah: ['', Validators.required],
      memorizationEndSurah: ['', Validators.required],
      revisionStartSurah: [''],
      revisionEndSurah: [''],
      score: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      notes: [''],
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.trackingId = +id;
        this.loadTracking(this.trackingId);
      }
    });
  }

  loadTracking(id: number) {
    this.service.getTrackingById(id).subscribe({
      next: (werd) => {
        werd.date = this.formatDateForInput(werd.date);

        this.form.patchValue(werd);
      },
      error: () => {
        console.log('فشل');
        this.message = 'فشل في تحميل البيانات';
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = this.form.value;

    if (this.isEditMode && this.trackingId !== null) {
      this.service.updateTracking(this.trackingId, data).subscribe({
        next: (res) => {
          this.router.navigate(['/student/quranTracking']);
        },
        error: () => {
          this.message = 'حدث خطأ أثناء التحديث';
        },
      });
    } else {
      this.service.addTracking(data).subscribe({
        next: (res) => {
          this.message = res.message || 'تم الحفظ بنجاح';
          this.form.reset();
        },
        error: () => {
          this.message = 'حدث خطأ أثناء الحفظ';
        },
      });
    }
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // "2025-07-28"
  }
}
