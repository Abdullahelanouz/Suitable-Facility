import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly BASE = 'http://localhost:5000/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(this.auth.token ? { Authorization: `Bearer ${this.auth.token}` } : {})
    });
  }

  // ─── Auth & Profile ─────────────────────────────
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.BASE}/auth/upload`, formData, { 
      headers: { 'Authorization': `Bearer ${this.auth.token}` } as any 
    });
  }

  getPublicServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE}/auth/services`);
  }

  getPublicTechnicians(serviceId?: string): Observable<any[]> {
    const url = serviceId ? `${this.BASE}/auth/technicians?service=${serviceId}` : `${this.BASE}/auth/technicians`;
    return this.http.get<any[]>(url);
  }

  // ─── Bookings ───────────────────────────────────
  createBooking(data: any): Observable<any> {
    // Portugal flow: use /bookings/auth for registered users
    return this.http.post(`${this.BASE}/bookings/auth`, data, { headers: this.headers });
  }

  updateBookingStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.BASE}/bookings/${id}/status`, { status }, { headers: this.headers });
  }

  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE}/bookings/mine`, { headers: this.headers });
  }

  getTechBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE}/bookings/tech`, { headers: this.headers });
  }

  // ─── Admin ──────────────────────────────────────
  getAdminUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE}/admin/users`, { headers: this.headers });
  }

  getAdminBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE}/admin/bookings`, { headers: this.headers });
  }

  // ─── UAE Inquiries ──────────────────────────────
  submitUaeInquiry(data: any): Observable<any> {
    return this.http.post(`${this.BASE}/uae-inquiries`, data);
  }

  getAdminUaeInquiries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE}/uae-inquiries`, { headers: this.headers });
  }

  updateUaeInquiryStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.BASE}/uae-inquiries/${id}/status`, { status }, { headers: this.headers });
  }

  deleteUaeInquiry(id: string): Observable<any> {
    return this.http.delete(`${this.BASE}/uae-inquiries/${id}`, { headers: this.headers });
  }

  // ─── General Contacts ───────────────────────────
  submitContact(data: any): Observable<any> {
    return this.http.post(`${this.BASE}/contacts`, data);
  }

  getAdminContacts(): Observable<any> {
    return this.http.get<any>(`${this.BASE}/contacts`, { headers: this.headers });
  }

  updateContactStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.BASE}/contacts/${id}/status`, { status }, { headers: this.headers });
  }

  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.BASE}/contacts/${id}`, { headers: this.headers });
  }
}
