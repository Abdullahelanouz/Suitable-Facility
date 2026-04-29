import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './overview.html',
  styleUrl: './overview.css'
})
export class AdminOverviewComponent implements OnInit {
  stats = [
    { label: 'Total Users', value: '0', icon: 'fa-users', color: '#6366f1', trend: '+0%' },
    { label: 'New Bookings', value: '0', icon: 'fa-calendar-plus', color: '#10b981', trend: '+0%' },
    { label: 'Technicians', value: '0', icon: 'fa-tools', color: '#f59e0b', trend: '0%' },
    { label: 'Revenue', value: '$0', icon: 'fa-dollar-sign', color: '#ec4899', trend: '+0%' }
  ];

  recentActivities: any[] = [];
  bookings: any[] = []; // Store full bookings for export
  isLoading = true;
  showAddTechModal = false;
  newTech = { name: '', email: '', password: 'password123', role: 'Technician' };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    forkJoin({
      users: this.apiService.getAdminUsers(),
      bookings: this.apiService.getAdminBookings()
    }).subscribe({
      next: (res: any) => {
        const users = res.users.data || [];
        this.bookings = res.bookings.data || [];

        // Update Stats
        this.stats[0].value = users.length.toString();
        this.stats[1].value = this.bookings.length.toString();
        this.stats[2].value = users.filter((u: any) => u.role === 'Technician').length.toString();
        
        // Mock revenue calculation
        this.stats[3].value = `$${this.bookings.length * 120}`;

        // Activities (Last 5 bookings)
        this.recentActivities = this.bookings.slice(0, 5).map((b: any) => ({
          user: b.client?.name || b.clientName || 'Guest',
          action: `Booked ${b.service || 'Service'}`,
          time: new Date(b.createdAt).toLocaleDateString(),
          status: b.status
        }));

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading overview data', err);
        this.isLoading = false;
      }
    });
  }

  exportReport() {
    if (this.bookings.length === 0) return alert('No data to export');

    const headers = ['ID', 'Client', 'Service', 'Date', 'Status'];
    const rows = this.bookings.map(b => [
      b.id,
      b.client?.name || b.clientName || 'Guest',
      b.service,
      new Date(b.createdAt).toLocaleDateString(),
      b.status
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `suitable_facility_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  addTechnician() {
    this.showAddTechModal = true;
  }

  saveTechnician() {
    // In a real app, we'd call an API. Here we'll mock success.
    alert(`Technician ${this.newTech.name} added successfully! (Mocked)`);
    this.showAddTechModal = false;
    this.loadData();
  }

  openSettings() {
    alert('System settings are currently locked to Global Defaults. Contact System Administrator.');
  }
}
