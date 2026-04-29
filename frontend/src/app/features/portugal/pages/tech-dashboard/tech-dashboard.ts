import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-tech-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tech-dashboard.html',
  styleUrl: './tech-dashboard.css'
})
export class TechDashboardComponent implements OnInit {
  bookings: any[] = [];
  isLoading = true;

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    public router: Router
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    this.apiService.getTechBookings().subscribe({
      next: (res: any) => {
        this.bookings = res || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading tech bookings', err);
        this.isLoading = false;
      }
    });
  }

  get pendingCount() {
    return this.bookings.filter(b => b.status === 'Pending').length;
  }

  get activeCount() {
    return this.bookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress').length;
  }

  acceptJob(id: number) {
    // API call to update status will go here
    console.log('Accept job', id);
  }
}
