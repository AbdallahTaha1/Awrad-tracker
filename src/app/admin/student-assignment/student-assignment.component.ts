import { CommonModule } from '@angular/common';
import { GroupDto } from '../../core/models/groupDtos/Group.Dto';
import { StudentDto } from '../../core/models/studentDtos/Student.dto';
import { GroupService } from '../../core/services/group.service';
import { StudentService } from '../../core/services/student.service';
import { RouterModule } from '@angular/router';
import { AdminHeaderComponent } from '../../layout/admin-header/admin-header.component';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-student',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AdminHeaderComponent,
    FormsModule,
  ],
  templateUrl: './student-assignment.component.html',
})
export class AssignStudentComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  students: (StudentDto & { selectedGroupId?: number | null })[] = [];
  groups: GroupDto[] = [];
  message: string | null = null;

  constructor(
    private studentService: StudentService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadStudents();
  }

  loadGroups() {
    this.groupService.getAll().subscribe({
      next: (res) => (this.groups = res),
      error: (err) => console.error('❌ Error loading groups:', err),
    });
  }

  loadStudents() {
    this.studentService.getAllWithGroup().subscribe({
      next: (res) => {
        this.students = res.map((student) => ({
          ...student,
          selectedGroupId: student.groupId || null, // to track if the selected group changed or not
        }));
      },
      error: (err) => console.error('❌ Error loading students:', err),
    });
  }

  changeGroup(student: any) {
    if (student.selectedGroupId == null) return;

    this.studentService
      .assignToGroup(student.id, student.selectedGroupId)
      .subscribe({
        next: () => {
          this.message = `✅ تم تحديث مجموعة ${student.fullName} بنجاح`;
          student.groupId = student.selectedGroupId;
          const newGroup = this.groups.find((g) => g.id === student.groupId);
          student.groupName = newGroup?.name || null;
          this.loadStudents();
        },
        error: (err) => {
          console.error(err);
          this.message = `❌ حدث خطأ أثناء التحديث`;
        },
      });
  }
}
