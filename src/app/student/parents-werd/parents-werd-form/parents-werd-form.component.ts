import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ParentsWerdService } from '../../../core/services/parents-werd.service';
import { CreateParentsWerd } from '../../../core/models/parentsWerdDtos/create-parents-werd';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../layout/header/header.component';

@Component({
  selector: 'app-parents-werd-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './parents-werd-form.component.html',
  styleUrl: './parents-werd-form.component.css',
})
export class ParentsWerdFormComponent {
  form: FormGroup;
  submitting = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private parentsWerdService: ParentsWerdService
  ) {
    this.form = this.fb.group({
      description: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting = true;
    this.successMessage = '';

    const dto: CreateParentsWerd = this.form.value;

    this.parentsWerdService.Create(dto).subscribe({
      next: () => {
        this.successMessage = 'تم حفظ الورد بنجاح';
        this.form.reset();
      },
      error: () => alert('حدث خطأ أثناء الحفظ'),
      complete: () => (this.submitting = false),
    });
  }

  get f() {
    return this.form.controls;
  }
}
