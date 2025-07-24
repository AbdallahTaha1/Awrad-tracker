import { Component, OnInit } from '@angular/core';
import { teacherWithGroups } from '../../core/models/teacher/teacherWithGroups';
import { GroupDto } from '../../core/models/groupDtos/Group.Dto';
import { GroupService } from '../../core/services/group.service';
import { TeacherService } from '../../core/services/teacher.service';
import { AdminHeaderComponent } from '../../layout/admin-header/admin-header.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssignTeacherGroupDto } from '../../core/models/assign-teacher-group.dto';

@Component({
  selector: 'app-assign-teacher',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminHeaderComponent,
    FormsModule,
  ],
  templateUrl: './assign-teacher.component.html',
})
export class AssignTeacherComponent implements OnInit {
  teachers: teacherWithGroups[] = [];
  groups: GroupDto[] = [];
  assignTeacherGroup!: AssignTeacherGroupDto;
  selectedGroups: { [teacherId: string]: number } = {};
  message: string = '';

  constructor(
    private teacherService: TeacherService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
    this.loadGroups();
  }

  loadTeachers() {
    this.teacherService.getAllWithGroups().subscribe({
      next: (data) => {
        console.log(data);
        this.teachers = data;
      },
      error: () => (this.message = 'فشل في تحميل المعلمين'),
    });
  }

  loadGroups() {
    this.groupService.getAll().subscribe({
      next: (data) => {
        console.log(data);
        this.groups = data;
      },
      error: () => (this.message = 'فشل في تحميل المجموعات'),
    });
  }

  assignGroup(teacherId: string) {
    const groupId = this.selectedGroups[teacherId];
    if (!groupId) return;

    const dto: AssignTeacherGroupDto = {
      teacherId: teacherId,
      groupId: groupId,
    };

    this.teacherService.assignToGroup(dto).subscribe({
      next: () => {
        this.message = 'تم الإسناد بنجاح';
        this.loadTeachers();
      },
      error: () => {
        this.message = 'فشل الإسناد';
      },
    });
  }

  removeGroup(teacherId: string, groupId: number) {
    const dto = { teacherId, groupId };
    this.teacherService.removeFromGroup(dto).subscribe({
      next: () => {
        this.message = 'تمت الإزالة بنجاح';
        this.loadTeachers();
      },
      error: () => {
        this.message = 'فشل في الإزالة';
      },
    });
  }
}
