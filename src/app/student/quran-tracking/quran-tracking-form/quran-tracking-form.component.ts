import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QuranTrackingService } from '../../../core/services/quran-tracking.service';

@Component({
  selector: 'app-quran-tracking-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quran-tracking-form.component.html',
  styleUrl: './quran-tracking-form.component.css',
})
export class QuranTrackingFormComponent {
  form!: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private service: QuranTrackingService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      memorizationStartSurah: ['', Validators.required],
      memorizationEndSurah: ['', Validators.required],
      revisionStartSurah: [''],
      revisionEndSurah: [''],
      score: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      notes: [''],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.service.addTracking(this.form.value).subscribe({
      next: (res) => {
        this.message = res.message;
        this.form.reset();
      },
      error: () => {
        this.message = 'حدث خطأ أثناء الحفظ';
      },
    });
  }
}
