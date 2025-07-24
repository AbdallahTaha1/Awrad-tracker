import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../core/services/teacher.service';
import { TeacherGroupDto } from '../core/models/teacher-group.dto';
import { HeaderComponent } from '../layout/header/header.component';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './teacher-dashboard.component.html',
})
export class TeacherDashboardComponent implements OnInit {
  groups: TeacherGroupDto[] = [];
  loading = false;
  errorMessage = '';

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.teacherService.getMyStudents().subscribe({
      next: (data) => {
        this.groups = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'حدث خطأ أثناء تحميل بيانات الطلاب';
        this.loading = false;
      },
    });
  }
}
