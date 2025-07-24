import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminHeaderComponent } from '../../layout/admin-header/admin-header.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class AdminDashboardComponent {
  cards = [
    {
      title: 'إدارة المجموعات',
      description: 'إنشاء وتعديل وحذف المجموعات',
      link: '/admin/groups',
    },
    {
      title: 'إسناد الطلاب',
      description: 'تعيين الطلاب إلى مجموعاتهم',
      link: '/admin/students/assign',
    },
    {
      title: 'إسناد المعلمين',
      description: 'ربط المعلمين بالمجموعات',
      link: '/admin/teachers/assign',
    },
    {
      title: 'إدارة الأوراد',
      description: 'إضافة وتحديث الأوراد للطلاب',
      link: '/admin/werd',
    },
  ];
}
