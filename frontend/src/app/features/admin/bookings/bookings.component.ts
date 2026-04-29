import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api';

@Component({
  selector: 'app-manage-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css'
})
export class ManageBookingsComponent implements OnInit {
  bookings: any[] = [];
  isLoading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    this.apiService.getAdminBookings().subscribe({
      next: (res: any) => {
        this.bookings = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading bookings', err);
        this.isLoading = false;
      }
    });
  }

  updateStatus(id: string, newStatus: string) {
    this.apiService.updateBookingStatus(id, newStatus).subscribe({
      next: () => {
        alert(`Booking ${newStatus} successfully!`);
        this.loadBookings();
      },
      error: (err) => {
        console.error('Update error', err);
        alert('Failed to update status.');
      }
    });
  }
}
