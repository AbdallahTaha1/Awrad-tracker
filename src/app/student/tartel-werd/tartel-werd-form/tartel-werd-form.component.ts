import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeaderComponent } from '../../../layout/header/header.component';
import { TartelWerdService } from '../../../core/services/tartel-werd.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tartel-werd-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, RouterModule],
  templateUrl: './tartel-werd-form.component.html',
  styleUrl: './tartel-werd-form.component.css',
})
export class TartelWerdFormComponent {
  werdForm: FormGroup;
  submitted = false;
  submitting = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private tartelWerdService: TartelWerdService,
    private router: Router
  ) {
    this.werdForm = this.fb.group({
      verses: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  submit(): void {
    this.submitted = true;
    if (this.werdForm.invalid) return;

    this.submitting = true;
    this.successMessage = '';

    this.tartelWerdService.addWerd(this.werdForm.value).subscribe({
      next: () => {
        this.successMessage = 'تم حفظ ورد بر الوالدين بنجاح!';

        // تأخير اختياري لعرض الرسالة قبل التوجيه
        console.log('Navigating...');

        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('حدث خطأ أثناء الإرسال:', err);
      },
      complete: () => {
        this.submitting = false;
      },
    });
  }
}
