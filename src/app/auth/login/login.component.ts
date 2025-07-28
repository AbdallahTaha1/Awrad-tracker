import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Login } from '../../core/models/authDtos/login.dto';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    if (this.form.invalid) return;

    this.loading = true;
    const data: Login = this.form.value as Login;

    this.authService.login(data).subscribe({
      next: (res) => {
        this.authService.saveAuthData(res.jwtToken, res.roles);

        // Navigate after successful registration
        if (res.roles?.includes('Student')) {
          this.router.navigate(['/student']);
        } else if (res.roles?.includes('Teacher')) {
          this.router.navigate(['/teacher']);
        } else if (res.roles?.includes('Admin')) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']); // fallback route
        }
      },
      error: (err) => {
        this.errorMessage = err.error || 'فشل تسجيل الدخول';
        this.loading = false;
      },
    });
  }
}
