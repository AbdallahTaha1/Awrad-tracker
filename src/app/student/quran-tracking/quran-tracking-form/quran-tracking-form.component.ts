import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QuranTrackingService } from '../../../core/services/quran-tracking.service';
import { HeaderComponent } from '../../../layout/header/header.component';

@Component({
  selector: 'app-quran-tracking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './quran-tracking-form.component.html',
  styleUrl: './quran-tracking-form.component.css',
})
export class QuranTrackingFormComponent {
  form!: FormGroup;
  message = '';
  isEditMode = false;
  trackingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: QuranTrackingService,
    private route: ActivatedRoute
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
      } else {
        // set default date for creation
        this.form.patchValue({
          date: new Date().toISOString().substring(0, 10),
        });
      }
    });
  }

  loadTracking(id: number) {
    this.service.getTrackingById(id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
      },
      error: () => {
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
          this.message = res.message || 'تم التحديث بنجاح';
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
}
