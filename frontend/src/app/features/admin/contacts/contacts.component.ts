import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.html',
  styleUrl: '../uae-inquiries/uae-inquiries.css' // Reuse styles
})
export class AdminContactsComponent implements OnInit {
  private apiService = inject(ApiService);
  contacts: any[] = [];
  loading = true;

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.loading = true;
    this.apiService.getAdminContacts().subscribe({
      next: (res: any) => {
        this.contacts = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading contacts:', err);
        this.loading = false;
      }
    });
  }

  updateStatus(id: string, status: string) {
    this.apiService.updateContactStatus(id, status).subscribe({
      next: () => this.loadContacts(),
      error: (err) => alert('Error updating status')
    });
  }

  deleteContact(id: string) {
    if (confirm('Delete this message?')) {
      this.apiService.deleteContact(id).subscribe({
        next: () => this.loadContacts(),
        error: (err) => alert('Error deleting message')
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Unread': return 'status-pending';
      case 'Read': return 'status-reviewed';
      case 'Replied': return 'status-contacted';
      default: return '';
    }
  }
}
