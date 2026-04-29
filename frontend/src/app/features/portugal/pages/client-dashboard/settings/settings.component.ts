import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth';

@Component({
  selector: 'app-client-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <h2 style="color: var(--primary); margin-bottom: 25px;">Profile Settings</h2>
      
      <div class="admin-card" style="max-width: 600px;">
        <form (ngSubmit)="updateProfile()">
          <div *ngIf="successMsg" class="alert success">{{ successMsg }}</div>
          
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="user.name" name="name" class="form-control">
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="user.email" name="email" class="form-control" disabled>
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" [(ngModel)]="user.phone" name="phone" class="form-control">
          </div>
          <div class="form-group">
            <label>Location / Address</label>
            <input type="text" [(ngModel)]="user.location" name="location" class="form-control">
          </div>
          <button type="submit" class="btn-premium btn-primary" style="margin-top: 20px;" [disabled]="isLoading">
            {{ isLoading ? 'Saving...' : 'Update Profile' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .settings-container { padding: 20px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 5px; font-weight: 700; color: var(--slate); }
    .form-control { width: 100%; padding: 12px; border: 1px solid var(--gray-med); border-radius: 8px; }
    .alert.success { background: #dcfce7; color: #166534; padding: 15px; border-radius: 12px; margin-bottom: 20px; }

    /* Responsive */
    @media (max-width: 768px) {
      .settings-container { padding: 10px; }
    }
  `]
})
export class ClientSettingsComponent {
  user: any = {};
  isLoading = false;
  successMsg = '';

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(u => this.user = { ...u });
  }

  updateProfile() {
    this.isLoading = true;
    this.authService.updateProfile(this.user).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMsg = 'Profile updated successfully!';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => this.isLoading = false
    });
  }
}
