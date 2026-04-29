import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/auth';
import { ApiService } from '../../../../../core/services/api';

@Component({
  selector: 'app-tech-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <h2 style="color: var(--primary); margin-bottom: 25px;">Professional Profile & Services</h2>
      
      <div class="admin-card" style="max-width: 800px;">
        <div *ngIf="successMsg" class="alert success">{{ successMsg }}</div>
        
        <form (ngSubmit)="saveProfile()">
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" [(ngModel)]="profile.name" name="name" class="form-control">
            </div>
            
            <div class="form-group">
              <label>Hourly Rate (€)</label>
              <input type="number" [(ngModel)]="profile.hourlyRate" name="hourlyRate" class="form-control">
            </div>

            <div class="form-group">
              <label>Years of Experience</label>
              <input type="number" [(ngModel)]="profile.experience" name="experience" class="form-control">
            </div>

            <div class="form-group">
              <label>Profile Image</label>
              <div class="avatar-upload-container">
                <img *ngIf="profile.avatar" [src]="profile.avatar" alt="Avatar Preview" class="avatar-preview">
                <div class="upload-wrapper">
                  <input type="file" (change)="onFileSelected($event)" class="form-control" accept="image/*" [disabled]="isUploading">
                  <small *ngIf="isUploading" style="color: var(--primary);">Uploading image...</small>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label style="display: block; margin-bottom: 15px;">Select the Services You Provide</label>
            <div class="services-selection-grid">
              <label *ngFor="let srv of availableServices" class="service-checkbox-card" [class.selected]="isSelected(srv.id)">
                <input type="checkbox" [checked]="isSelected(srv.id)" (change)="toggleService(srv.id)" style="display: none;">
                <div class="checkbox-ui">
                   <i class="fa-solid" [ngClass]="isSelected(srv.id) ? 'fa-check-circle' : 'fa-circle-plus'"></i>
                   <span>{{ srv.name_en }}</span>
                </div>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>About Me / Professional Bio</label>
            <textarea [(ngModel)]="profile.bio" name="bio" class="form-control" style="height: 120px;"></textarea>
          </div>

          <button type="submit" class="btn-premium btn-primary" [disabled]="isLoading">
            {{ isLoading ? 'Saving...' : 'Save Professional Profile' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .settings-container { padding: 20px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group { margin-bottom: 25px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 700; color: var(--slate); font-size: 0.9rem; }
    .form-control { width: 100%; padding: 12px; border: 1px solid var(--gray-med); border-radius: 12px; }
    
    .services-selection-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; }
    .service-checkbox-card { cursor: pointer; border: 1px solid var(--gray-med); padding: 12px; border-radius: 12px; transition: all 0.2s; }
    .service-checkbox-card.selected { border-color: var(--primary); background: #f0fdf4; color: var(--primary); }
    .checkbox-ui { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 0.9rem; }
    
    .alert.success { background: #dcfce7; color: #166534; padding: 15px; border-radius: 12px; margin-bottom: 20px; }
    
    .avatar-upload-container { display: flex; align-items: center; gap: 15px; }
    .avatar-preview { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary); }
    .upload-wrapper { flex: 1; }

    /* Responsive */
    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; gap: 10px; }
      .services-selection-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 480px) {
      .services-selection-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class TechSettingsComponent implements OnInit {
  profile: any = {};
  availableServices: any[] = [];
  selectedServiceIds: string[] = [];
  isLoading = false;
  isUploading = false;
  successMsg = '';

  constructor(private authService: AuthService, private apiService: ApiService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.profile = { ...user };
        this.selectedServiceIds = user.providedServices ? user.providedServices.map((s: any) => s.id) : [];
      }
    });

    this.apiService.getPublicServices().subscribe(res => {
      this.availableServices = res;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.apiService.uploadImage(file).subscribe({
        next: (res) => {
          this.profile.avatar = res.url;
          this.isUploading = false;
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.isUploading = false;
          alert('Failed to upload image. Please try again.');
        }
      });
    }
  }

  isSelected(id: string) {
    return this.selectedServiceIds.includes(id);
  }

  toggleService(id: string) {
    if (this.isSelected(id)) {
      this.selectedServiceIds = this.selectedServiceIds.filter(sid => sid !== id);
    } else {
      this.selectedServiceIds.push(id);
    }
  }

  saveProfile() {
    this.isLoading = true;
    const data = { ...this.profile, services: this.selectedServiceIds };

    this.authService.updateProfile(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMsg = 'Profile and services updated successfully!';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => this.isLoading = false
    });
  }
}
