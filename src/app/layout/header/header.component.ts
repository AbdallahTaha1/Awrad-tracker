import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userName: string = '';
  userRole: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userName = this.authService.getUserName();
    const roles = this.authService.getUserRoles();
    if (roles.length > 0) {
      this.userRole = roles[0]; // أو استخدم جميع الأدوار لو فيه أكثر من واحد
    }
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
