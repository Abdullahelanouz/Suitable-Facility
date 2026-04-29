import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-uae-inquiries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './uae-inquiries.html',
  styleUrl: './uae-inquiries.css'
})
export class UaeInquiriesComponent implements OnInit {
  private apiService = inject(ApiService);
  inquiries: any[] = [];
  loading = true;

  ngOnInit() {
    this.loadInquiries();
  }

  loadInquiries() {
    this.loading = true;
    this.apiService.getAdminUaeInquiries().subscribe({
      next: (data) => {
        this.inquiries = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading UAE inquiries:', err);
        this.loading = false;
      }
    });
  }

  updateStatus(id: string, status: string) {
    this.apiService.updateUaeInquiryStatus(id, status).subscribe({
      next: () => this.loadInquiries(),
      error: (err) => alert('Error updating status')
    });
  }

  deleteInquiry(id: string) {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      this.apiService.deleteUaeInquiry(id).subscribe({
        next: () => this.loadInquiries(),
        error: (err) => alert('Error deleting inquiry')
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Reviewed': return 'status-reviewed';
      case 'Contacted': return 'status-contacted';
      case 'Closed': return 'status-closed';
      default: return '';
    }
  }
}
