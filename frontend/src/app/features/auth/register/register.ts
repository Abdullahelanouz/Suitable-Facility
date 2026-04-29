import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { ApiService } from '../../../core/services/api';


import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  phone = '';
  location = '';
  role = 'Client';
  experience: number | null = null;
  hourlyRate: number | null = null;
  bio = '';
  avatar = '';
  isLoading = false;
  errorMsg = '';


  constructor(private authService: AuthService, private apiService: ApiService, private router: Router) { }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.apiService.uploadImage(file).subscribe({
        next: (res) => this.avatar = res.url,
        error: (err) => console.error('Upload failed', err)
      });
    }
  }


  handleRegister() {
    if (!this.name || !this.email || !this.password || !this.phone || !this.location) {
      this.errorMsg = 'Please fill in all required fields.';
      return;
    }
    if (this.password.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters.';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    this.authService.register(
      this.name, 
      this.email, 
      this.password, 
      this.role, 
      this.phone, 
      this.location,
      this.experience || 0, 
      this.hourlyRate || 0, 
      this.bio, 
      this.avatar
    ).subscribe({

      next: (res) => {
        this.isLoading = false;
        if (res.user.role === 'Technician') {
          this.router.navigate(['/portugal/dashboard/tech']);
        } else {
          this.router.navigate(['/portugal/services']);
        }

      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
