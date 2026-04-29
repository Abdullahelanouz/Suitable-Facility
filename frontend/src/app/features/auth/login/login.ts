import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  handleLogin() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Please enter your email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        // Route based on role
        if (res.user.role === 'Technician') {
          this.router.navigate(['/portugal/dashboard/tech']);
        } else if (res.user.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/portugal/services']);
        }

      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Invalid credentials. Please try again.';
      }
    });
  }
}
