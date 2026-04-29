import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-client-requests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="requests-container">
      <div class="page-header">
        <div>
          <h2>My Service Requests</h2>
          <p>Track the status of your bookings below</p>
        </div>
        <span class="total-badge">{{ bookings.length }} Request{{ bookings.length !== 1 ? 's' : '' }}</span>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && bookings.length === 0" class="empty-state">
        <i class="fa-solid fa-calendar-xmark"></i>
        <h3>No Service Requests Yet</h3>
        <p>Browse our services and book a technician to get started.</p>
        <a href="/portugal/services" class="btn-browse">Browse Services</a>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i> Loading your requests...
      </div>

      <!-- Table -->
      <div class="table-wrapper" *ngIf="!isLoading && bookings.length > 0">
        <table class="requests-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Technician</th>
              <th>Scheduled Date</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of bookings" class="booking-row">
              <td>
                <div class="service-cell">
                  <i class="fa-solid fa-tools"></i>
                  <strong>{{ b.service }}</strong>
                </div>
              </td>
              <td>
                <div class="tech-cell">
                  <div class="tech-avatar-sm">{{ (b.technician?.name || 'P')[0] }}</div>
                  {{ b.technician?.name || '—' }}
                </div>
              </td>
              <td>
                <div class="date-cell">
                  <i class="fa-regular fa-calendar"></i>
                  {{ b.scheduledDate ? (b.scheduledDate | date:'dd MMM yyyy, HH:mm') : '—' }}
                </div>
              </td>
              <td class="desc-cell">{{ b.description || '—' }}</td>
              <td>
                <span class="status-pill" [ngClass]="b.status?.toLowerCase()">
                  {{ b.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .requests-container { padding: 10px 0; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .page-header h2 {
      color: var(--primary);
      margin: 0 0 5px 0;
      font-size: 1.5rem;
    }
    .page-header p {
      color: var(--slate);
      margin: 0;
      font-size: 0.9rem;
    }
    .total-badge {
      background: var(--primary);
      color: white;
      padding: 6px 16px;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 700;
    }

    .table-wrapper {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      overflow: hidden;
      border: 1px solid rgba(0,0,0,0.06);
    }

    .requests-table {
      width: 100%;
      border-collapse: collapse;
    }
    .requests-table thead tr {
      background: #f8fafc;
      border-bottom: 2px solid #e2e8f0;
    }
    .requests-table th {
      padding: 14px 20px;
      text-align: left;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--slate);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .requests-table td {
      padding: 16px 20px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 0.9rem;
      color: #334155;
    }
    .booking-row:last-child td { border-bottom: none; }
    .booking-row:hover td { background: #fafcff; }

    .service-cell {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      color: var(--primary);
    }
    .service-cell i { color: var(--accent); font-size: 0.9rem; }

    .tech-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .tech-avatar-sm {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .date-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--slate);
    }
    .date-cell i { color: var(--primary); opacity: 0.6; }

    .desc-cell {
      color: var(--slate);
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status-pill {
      padding: 5px 14px;
      border-radius: 50px;
      font-size: 0.78rem;
      font-weight: 700;
      display: inline-block;
      white-space: nowrap;
    }
    .status-pill.pending    { background: #fef9c3; color: #92400e; }
    .status-pill.confirmed  { background: #dcfce7; color: #14532d; }
    .status-pill.inprogress { background: #dbeafe; color: #1e3a8a; }
    .status-pill.completed  { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .status-pill.cancelled  { background: #fee2e2; color: #991b1b; }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      color: var(--slate);
    }
    .empty-state i { font-size: 3rem; color: var(--gray-med); margin-bottom: 20px; }
    .empty-state h3 { color: var(--primary); margin-bottom: 10px; }
    .btn-browse {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 28px;
      background: var(--primary);
      color: white;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
    }
    .loading-state {
      text-align: center;
      padding: 60px;
      color: var(--slate);
      font-size: 1rem;
    }
    .loading-state i { margin-right: 10px; color: var(--primary); }

    /* Responsive */
    @media (max-width: 768px) {
      .page-header { flex-direction: column; align-items: flex-start; gap: 10px; }
      .table-wrapper { border-radius: 8px; }
      .requests-table th, .requests-table td { padding: 12px 10px; font-size: 0.85rem; }
      .service-cell { flex-direction: column; align-items: flex-start; gap: 4px; }
      .tech-cell { flex-direction: column; align-items: flex-start; gap: 4px; }
      .status-pill { padding: 4px 10px; font-size: 0.7rem; }
    }
    @media (max-width: 600px) {
      .requests-table { display: block; overflow-x: auto; white-space: nowrap; }
    }
  `]
})
export class ClientRequestsComponent implements OnInit {
  bookings: any[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('sf_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<any[]>('http://localhost:5000/api/bookings/mine', { headers }).subscribe({
      next: (res) => { this.bookings = res; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }
}
