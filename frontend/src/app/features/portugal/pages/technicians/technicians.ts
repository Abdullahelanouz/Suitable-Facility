import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-technicians',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './technicians.html',
  styleUrl: './technicians.css'
})
export class TechniciansComponent implements OnInit {
  private readonly API = 'http://localhost:5000/api';

  technicians: any[] = [];
  selectedTech: any = null;
  bookingModalActive = false;
  detailsModalActive = false;
  isLoading = true;
  serviceFilterLabel = 'All Services';

  bookingData = {
    scheduledDate: '',
    description: '',
    service: '',
    location: '',
    clientPhone: ''
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const service = params['service'];
      this.loadTechnicians(service);
    });
  }

  loadTechnicians(service?: string) {
    this.isLoading = true;
    const url = service
      ? `${this.API}/auth/technicians?service=${encodeURIComponent(service)}`
      : `${this.API}/auth/technicians`;

    this.http.get<any[]>(url).subscribe({
      next: (res) => {
        this.technicians = res;
        this.isLoading = false;
        this.serviceFilterLabel = service ? decodeURIComponent(service) : 'All Services';
        this.bookingData.service = this.serviceFilterLabel;
      },
      error: (err) => {
        console.error('Failed to load techs', err);
        this.isLoading = false;
      }
    });
  }

  openDetailsModal(tech: any) {
    this.selectedTech = tech;
    this.detailsModalActive = true;
  }

  closeDetailsModal() {
    this.detailsModalActive = false;
  }

  openBookingModal(tech: any) {
    const token = localStorage.getItem('sf_token');
    const userStr = localStorage.getItem('sf_user');
    
    if (!token) {
      alert('Please login first to book a technician.');
      window.location.href = '/auth/login';
      return;
    }

    if (userStr) {
      const user = JSON.parse(userStr);
      this.bookingData.location = user.location || '';
      this.bookingData.clientPhone = user.phone || '';
    }

    this.selectedTech = tech;
    this.bookingModalActive = true;
  }

  closeBookingModal() {
    this.bookingModalActive = false;
  }

  confirmBooking() {
    const token = localStorage.getItem('sf_token');
    if (!token) return;

    const payload = {
      ...this.bookingData,
      technicianId: this.selectedTech.id,
      service: this.bookingData.service || this.selectedTech.providedServices?.[0]?.name_en || 'General Maintenance'
    };

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.post(`${this.API}/bookings/auth`, payload, { headers }).subscribe({
      next: () => {
        alert('Booking sent! Track it in your dashboard.');
        this.closeBookingModal();
        window.location.href = '/portugal/dashboard/client/requests';
      },
      error: (err) => {
        alert('Failed to send booking. Please try again.');
        console.error(err);
      }
    });
  }
}
