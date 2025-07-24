import { Component } from '@angular/core';
import { ListeningWerdService } from '../../../listening-werd.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../layout/header/header.component';
import { ListeningWerdDto } from '../../../core/models/listeningWerd/listening-werd-dto';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listening-werd-list',
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, RouterModule],
  templateUrl: './listening-werd-list.component.html',
  styleUrl: './listening-werd-list.component.css',
})
export class ListeningWerdListComponent {
  werds: ListeningWerdDto[] = [];
  editingWerdId: number | null = null;
  editForm!: FormGroup;
  loading = false;

  constructor(
    private werdService: ListeningWerdService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      lectureName: [''],
      teacherName: [''],
      lectureLength: [''],
      lectureDate: [''],
      description: [''],
    });

    this.loadThisWeekWerds();
  }

  private getWeekStartAndEnd(): [Date, Date] {
    const today = new Date();
    const day = today.getDay(); // 0 (Sun) to 6 (Sat)
    const diffToSaturday = (day + 1) % 7; // How many days since Saturday
    const start = new Date(today);
    start.setDate(today.getDate() - diffToSaturday);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return [start, end];
  }

  loadThisWeekWerds(): void {
    this.loading = true;
    const [start, end] = this.getWeekStartAndEnd();

    this.werdService.getMyWerds().subscribe({
      next: (all) => {
        this.werds = all.filter((w) => {
          const date = new Date(w.lectureDate);
          return date >= start && date <= end;
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading werds', err);
        this.loading = false;
      },
    });
  }

  startEdit(werd: ListeningWerdDto) {
    this.editingWerdId = werd.id;
    this.editForm.patchValue(werd);
  }

  cancelEdit() {
    this.editingWerdId = null;
    this.editForm.reset();
  }

  saveEdit(id: number) {
    this.werdService.update(id, this.editForm.value).subscribe({
      next: () => {
        this.loadThisWeekWerds();
        this.cancelEdit();
      },
      error: (err) => console.error('Update failed', err),
    });
  }

  delete(id: number) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا الورد؟')) {
      this.werdService.delete(id).subscribe({
        next: () => this.loadThisWeekWerds(),
        error: (err) => console.error('Delete failed', err),
      });
    }
  }
}
