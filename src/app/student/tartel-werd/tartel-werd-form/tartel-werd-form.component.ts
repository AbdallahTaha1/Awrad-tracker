import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../layout/header/header.component';
import { TartelWerdService } from '../../../core/services/tartel-werd.service';
import { CreateTartelWerd } from '../../../core/models/tartelWerdDtos/create-tartel-werd';

@Component({
  selector: 'app-tartel-werd-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, RouterModule],
  templateUrl: './tartel-werd-form.component.html',
  styleUrl: './tartel-werd-form.component.css',
})
export class TartelWerdFormComponent implements OnInit {
  werdForm: FormGroup;
  submitted = false;
  submitting = false;
  successMessage = '';
  isEditMode = false;
  werdId?: number;

  constructor(
    private fb: FormBuilder,
    private tartelWerdService: TartelWerdService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.werdForm = this.fb.group({
      verses: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.werdId = +idParam;
      this.loadWerd(this.werdId);
    }
  }

  loadWerd(id: number): void {
    this.tartelWerdService.getWerdById(id).subscribe({
      next: (werd) => {
        this.werdForm.patchValue({
          verses: werd.verses,
          description: werd.description,
          date: werd.date,
        });
      },
      error: (err) => {
        console.error('فشل في تحميل البيانات:', err);
      },
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.werdForm.invalid) return;

    this.submitting = true;
    this.successMessage = '';

    const payload: CreateTartelWerd = this.werdForm.value;

    if (this.isEditMode && this.werdId) {
      this.tartelWerdService.update(this.werdId, payload).subscribe({
        next: () => {
          this.successMessage = 'تم تعديل الورد بنجاح!';
          this.router.navigate(['/student/tartel']);
        },
        error: (err) => {
          console.error('خطأ أثناء التعديل:', err);
        },
        complete: () => {
          this.submitting = false;
        },
      });
    } else {
      this.tartelWerdService.addWerd(payload).subscribe({
        next: () => {
          this.successMessage = 'تم حفظ ورد جديد بنجاح!';
          this.router.navigate(['/student/tartel']);
        },
        error: (err) => {
          console.error('خطأ أثناء الحفظ:', err);
        },
        complete: () => {
          this.submitting = false;
        },
      });
    }
  }
}
