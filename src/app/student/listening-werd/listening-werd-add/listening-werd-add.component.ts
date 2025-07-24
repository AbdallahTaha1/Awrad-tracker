import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ListeningWerdService } from '../../../listening-werd.service';
import { Router } from '@angular/router';
import { CreateListeningWerdDto } from '../../../core/models/listeningWerd/create-listening-werd-dto';

@Component({
  selector: 'app-listening-werd-add',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './listening-werd-add.component.html',
  styleUrl: './listening-werd-add.component.css',
})
export class ListeningWerdAddComponent {
  form!: FormGroup;
  isSubmitting = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private listeningWerdService: ListeningWerdService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      lectureName: ['', [Validators.required, Validators.maxLength(200)]],
      teacherName: ['', [Validators.required, Validators.maxLength(100)]],
      lectureLength: ['', [Validators.required, Validators.maxLength(50)]],
      lectureDate: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting = true;
    const listenignWerd: CreateListeningWerdDto = this.form.value;
    this.listeningWerdService.create(listenignWerd).subscribe({
      next: () => {
        this.router.navigate(['/student/listening']); // adjust as needed
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'حدث خطأ أثناء حفظ البيانات';
        console.error(err);
      },
    });
  }
}
