import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../layout/header/header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class StudentDashboardComponent {
  constructor(private router: Router) {}

  goTo(section: 'salah' | 'werd' | 'report' | 'listening' | 'quranTracking') {
    if (section === 'salah') this.router.navigate(['student/salah']);
    else if (section === 'werd') this.router.navigate(['/student/werd']);
    else if (section === 'report')
      this.router.navigate(['/student/weekly-report']);
    else if (section === 'listening')
      this.router.navigate(['/student/listening']);
    else if (section === 'quranTracking')
      this.router.navigate(['/student/quranTracking']);
  }
}
