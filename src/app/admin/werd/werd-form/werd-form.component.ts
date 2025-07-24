import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WerdService } from '../../../core/services/werd.service';
import { UpdateWerdDto } from '../../../core/models/werd/update-werd.dto';
import { CreateWerdDto } from '../../../core/models/werd/create-werd.dto';
import { TaskType } from '../../../core/models/TaskType.enum';
import { AdminHeaderComponent } from '../../../layout/admin-header/admin-header.component';

@Component({
  selector: 'app-werd-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminHeaderComponent],
  templateUrl: './werd-form.component.html',
})
export class WerdFormComponent implements OnInit {
  form!: FormGroup;
  TaskType = TaskType;
  isEdit = false;
  werdId!: number;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private werdService: WerdService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      type: [TaskType.Daily, Validators.required],
      score: [1, [Validators.required, Validators.min(1)]],
      Order: [1, [Validators.required, Validators.min(1)]],
      isActive: [true],
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.werdId = +idParam;
      this.loadWerd();
    }
  }

  loadWerd() {
    this.werdService.getById(this.werdId).subscribe({
      next: (werd) => this.form.patchValue(werd),
      error: (err) => {
        console.error(err);
        this.errorMessage = 'تعذر تحميل بيانات الورد.';
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const dto = {
      ...this.form.value,
      type: Number(this.form.value.type),
      maxScore: Number(this.form.value.score),
      isActive: Boolean(this.form.value.isActive),
      Order: Number(this.form.value.Order),
    };

    if (this.isEdit) {
      const updateDto: UpdateWerdDto = { id: this.werdId, ...dto };
      this.werdService.update(updateDto).subscribe({
        next: () => {
          this.router.navigate(['/admin/werd']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'فشل في التحديث.';
        },
      });
    } else {
      const createDto: CreateWerdDto = dto;
      this.werdService.create(createDto).subscribe({
        next: () => this.router.navigate(['/admin/werd']),
        error: (err) => {
          console.error(err);
          this.errorMessage = 'فشل في الإضافة.';
        },
      });
    }
  }
}
