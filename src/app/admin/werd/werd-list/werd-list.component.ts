import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { WerdDto } from '../../../core/models/werd/werd.dto';
import { WerdService } from '../../../core/services/werd.service';
import { TaskType } from '../../../core/models/TaskType.enum';
import { AdminHeaderComponent } from '../../../layout/admin-header/admin-header.component';

@Component({
  selector: 'app-werd-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminHeaderComponent],
  templateUrl: './werd-list.component.html',
})
export class WerdListComponent implements OnInit {
  TaskType = TaskType;
  werds: WerdDto[] = [];
  loading = false;
  constructor(private werdService: WerdService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.werdService.getAll().subscribe({
      next: (data) => {
        console.log(data);
        this.werds = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading Werds', err);
        this.loading = false;
      },
    });
  }

  editWerd(id: number) {
    this.router.navigate(['/admin/werd/edit', id]);
  }

  deleteWerd(id: number) {
    if (confirm('هل أنت متأكد من حذف هذا الورد؟')) {
      this.werdService.delete(id).subscribe(() => {
        this.werds = this.werds.filter((w) => w.id !== id);
      });
    }
  }
}
