import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-dashboard.html',
  styleUrl: './client-dashboard.css'
})
export class ClientDashboardComponent implements OnInit {
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
    this.apiService.getMyBookings().subscribe({
      next: (res: any) => {
        this.bookings = res || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading client bookings', err);
        this.isLoading = false;
      }
    });
  }

  get activeCount() {
    return this.bookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress').length;
  }

  get pendingCount() {
    return this.bookings.filter(b => b.status === 'Pending').length;
  }

  get completedCount() {
    return this.bookings.filter(b => b.status === 'Completed').length;
  }
}
