import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Register } from '../../core/models/auth/register.dto';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../layout/header/header.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['Student', Validators.required],
    });
  }

  register() {
    if (this.form.invalid) return;

    this.loading = true;
    const data: Register = this.form.value as Register;

    this.authService.register(data).subscribe({
      next: (res) => {
        if (!res.isAuthenticated) {
          this.errorMessage = res.message || 'فشل التسجيل';
        } else {
          this.authService.saveAuthData(res.jwtToken, res.roles);
          this.loading = false;

          // Navigate after successful registration
          if (res.roles?.includes('Student')) {
            this.router.navigate(['/student']);
          } else if (res.roles?.includes('Teacher')) {
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/']); // fallback route
          }
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('HTTP Error:', err.error?.message || err.message || err);
        this.errorMessage = err.error?.message || 'حدث خطأ ما. حاول مرة أخرى.';
      },
    });
  }
}
