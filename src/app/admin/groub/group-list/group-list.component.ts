import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GroupService } from '../../../core/services/group.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminHeaderComponent } from '../../../layout/admin-header/admin-header.component';
import { GroupDto } from '../../../core/models/groupDtos/Group.Dto';

@Component({
  selector: 'app-group-list',
  imports: [CommonModule, FormsModule, RouterModule, AdminHeaderComponent],
  templateUrl: './group-list.component.html',
})
export class GroupListComponent implements OnInit {
  groups: GroupDto[] = [];
  loading = false;
  errorMessage = '';

  constructor(private groupService: GroupService, private router: Router) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups() {
    this.loading = true;
    this.groupService.getAll().subscribe({
      next: (data) => {
        this.groups = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'حدث خطأ أثناء تحميل المجموعات.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  editGroup(id: number) {
    this.router.navigate(['/admin/groups/edit', id]);
  }

  deleteGroup(id: number) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذه المجموعة؟')) {
      this.groupService.delete(id).subscribe({
        next: () => {
          this.groups = this.groups.filter((g) => g.id !== id);
        },
        error: (err) => {
          this.errorMessage = 'تعذر حذف المجموعة.';
          console.error(err);
        },
      });
    }
  }
}
