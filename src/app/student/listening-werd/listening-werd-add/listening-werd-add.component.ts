import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateListeningWerdDto } from '../../../core/models/listeningWerd/create-listening-werd-dto';
import { ListeningWerdService } from '../../../core/services/listening-werd.service';
import { HeaderComponent } from '../../../layout/header/header.component';

@Component({
  selector: 'app-listening-werd-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './listening-werd-add.component.html',
  styleUrl: './listening-werd-add.component.css',
})
export class ListeningWerdAddComponent {
  form!: FormGroup;
  isSubmitting = false;
  errorMessage: string = '';
  isEditMode = false;
  werdId?: number;

  constructor(
    private fb: FormBuilder,
    private listeningWerdService: ListeningWerdService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      lectureName: ['', [Validators.required, Validators.maxLength(200)]],
      teacherName: ['', [Validators.required, Validators.maxLength(100)]],
      lectureLength: ['', [Validators.required, Validators.maxLength(50)]],
      lectureDate: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(500)]],
    });

    // Check for edit mode
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.werdId = +idParam;
        this.loadWerd(this.werdId);
      }
    });
  }

  loadWerd(id: number): void {
    this.listeningWerdService.getById(id).subscribe({
      next: (werd) => {
        werd.lectureDate = this.formatDateForInput(werd.lectureDate);

        this.form.patchValue(werd);
      },
      error: (err) => {
        this.errorMessage = 'فشل تحميل بيانات الورد.';
        console.error(err);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting = true;

    if (this.isEditMode && this.werdId) {
      const updateDto: CreateListeningWerdDto = {
        id: this.werdId,
        ...this.form.value,
      };

      this.listeningWerdService.update(this.werdId, updateDto).subscribe({
        next: () => this.router.navigate(['/student/listening']),
        error: (err) => {
          this.errorMessage = 'فشل في تحديث البيانات.';
          this.isSubmitting = false;
          console.error(err);
        },
      });
    } else {
      const createDto: CreateListeningWerdDto = this.form.value;

      this.listeningWerdService.create(createDto).subscribe({
        next: () => this.router.navigate(['/student/listening']),
        error: (err) => {
          this.errorMessage = 'حدث خطأ أثناء حفظ البيانات.';
          this.isSubmitting = false;
          console.error(err);
        },
      });
    }
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // "2025-07-28"
  }
}
