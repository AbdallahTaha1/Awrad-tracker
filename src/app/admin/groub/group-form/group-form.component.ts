import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../core/services/group.service';
import { AdminHeaderComponent } from '../../../layout/admin-header/admin-header.component';
import { GroupDto } from '../../../core/models/groupDtos/Group.Dto';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminHeaderComponent],
  templateUrl: './group-form.component.html',
})
export class GroupFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  errorMessage = '';
  loading = false;
  groupId?: number;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.groupId = +id;
      this.isEditMode = true;

      this.groupService.getById(this.groupId).subscribe({
        next: (group) => {
          this.form.patchValue({
            name: group.name,
          });
        },
        error: (err) => {
          this.errorMessage = 'فشل في تحميل بيانات المجموعة.';
          console.error(err);
        },
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const data = this.form.value as GroupDto;

    if (this.isEditMode && this.groupId) {
      this.groupService.update(this.groupId, data).subscribe({
        next: () => this.router.navigate(['/admin/groups']),
        error: (err) => {
          this.errorMessage = 'فشل في التحديث';
          this.loading = false;
          console.error(err);
        },
      });
    } else {
      this.groupService.create(data).subscribe({
        next: () => this.router.navigate(['/admin/groups']),
        error: (err) => {
          this.errorMessage = 'فشل في الإنشاء';
          this.loading = false;
          console.error(err);
        },
      });
    }
  }
}
