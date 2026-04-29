import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-tech-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="history-container">
      <div class="page-header">
        <div>
          <h2>Incoming & Past Jobs</h2>
          <p>Track all your assigned service requests below</p>
        </div>
        <span class="total-badge">{{ bookings.length }} Job{{ bookings.length !== 1 ? 's' : '' }}</span>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && bookings.length === 0" class="empty-state">
        <i class="fa-solid fa-inbox"></i>
        <h3>No Jobs Assigned Yet</h3>
        <p>When clients book your services, they will appear here.</p>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state">
        <i class="fa-solid fa-spinner fa-spin"></i> Loading your jobs...
      </div>

      <!-- Table -->
      <div class="table-wrapper" *ngIf="!isLoading && bookings.length > 0">
        <table class="history-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Service</th>
              <th>Scheduled Date</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of bookings" class="booking-row">
              <td>
                <div class="client-cell">
                  <div class="client-avatar-sm">{{ (b.client?.name || b.clientName || 'C')[0] }}</div>
                  <div>
                    <div style="font-weight: 700;">{{ b.client?.name || b.clientName || 'Unknown Client' }}</div>
                    <div style="font-size: 0.8rem; color: var(--slate);" *ngIf="b.client?.phone || b.clientPhone">
                      <i class="fa-solid fa-phone" style="font-size: 0.7rem;"></i> {{ b.client?.phone || b.clientPhone }}
                    </div>
                    <div style="font-size: 0.8rem; color: var(--slate);" *ngIf="b.location">
                      <i class="fa-solid fa-location-dot" style="font-size: 0.7rem;"></i> {{ b.location }}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div class="service-cell">
                  <i class="fa-solid fa-tools"></i>
                  <strong>{{ b.service }}</strong>
                </div>
              </td>
              <td>
                <div class="date-cell">
                  <i class="fa-regular fa-calendar"></i>
                  {{ b.scheduledDate ? (b.scheduledDate | date:'dd MMM yyyy, HH:mm') : 'Not Scheduled' }}
                </div>
              </td>
              <td class="desc-cell" [title]="b.description">{{ b.description || '—' }}</td>
              <td>
                <span class="status-pill" [ngClass]="b.status?.toLowerCase()">
                  {{ b.status }}
                </span>
              </td>
              <td>
                <div class="action-buttons" *ngIf="b.status === 'Pending'">
                  <button class="btn-action accept" title="Accept Job" (click)="updateStatus(b.id, 'Confirmed')"><i class="fa-solid fa-check"></i></button>
                  <button class="btn-action decline" title="Decline Job" (click)="updateStatus(b.id, 'Cancelled')"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="action-buttons" *ngIf="b.status === 'Confirmed' || b.status === 'InProgress'">
                  <button class="btn-action update" title="Mark as Completed" (click)="updateStatus(b.id, 'Completed')"><i class="fa-solid fa-flag-checkered"></i></button>
                </div>
                <div *ngIf="b.status === 'Completed' || b.status === 'Cancelled'" style="color: var(--slate); font-size: 0.85rem;">
                  No Actions
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .history-container { padding: 10px 0; }

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

    .history-table {
      width: 100%;
      border-collapse: collapse;
    }
    .history-table thead tr {
      background: #f8fafc;
      border-bottom: 2px solid #e2e8f0;
    }
    .history-table th {
      padding: 14px 20px;
      text-align: left;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--slate);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .history-table td {
      padding: 16px 20px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 0.9rem;
      color: #334155;
      vertical-align: middle;
    }
    .booking-row:last-child td { border-bottom: none; }
    .booking-row:hover td { background: #fafcff; }

    .client-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .client-avatar-sm {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--primary));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .service-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--primary);
    }
    .service-cell i { color: var(--accent); opacity: 0.8; }

    .date-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--slate);
      font-size: 0.85rem;
    }
    .date-cell i { color: var(--primary); opacity: 0.6; }

    .desc-cell {
      color: var(--slate);
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.85rem;
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

    .action-buttons {
      display: flex;
      gap: 8px;
    }
    .btn-action {
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: all 0.2s;
    }
    .btn-action.accept { background: #10b981; }
    .btn-action.accept:hover { background: #059669; transform: translateY(-2px); }
    .btn-action.decline { background: #ef4444; }
    .btn-action.decline:hover { background: #dc2626; transform: translateY(-2px); }
    .btn-action.update { background: var(--primary); }
    .btn-action.update:hover { background: var(--slate); transform: translateY(-2px); }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      color: var(--slate);
    }
    .empty-state i { font-size: 3rem; color: var(--gray-med); margin-bottom: 20px; }
    .empty-state h3 { color: var(--primary); margin-bottom: 10px; }
    
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
      .history-table th, .history-table td { padding: 12px 10px; font-size: 0.85rem; }
      .client-cell { flex-direction: column; align-items: flex-start; gap: 4px; }
      .service-cell { flex-direction: column; align-items: flex-start; gap: 4px; }
    }
    @media (max-width: 600px) {
      .history-table { display: block; overflow-x: auto; white-space: nowrap; }
    }
  `]
})
export class TechHistoryComponent implements OnInit {
  bookings: any[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    const token = localStorage.getItem('sf_token');
    if (!token) {
      this.isLoading = false;
      return;
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.get<any[]>('http://localhost:5000/api/bookings/tech', { headers }).subscribe({
      next: (res) => {
        this.bookings = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load tech bookings', err);
        this.isLoading = false;
      }
    });
  }

  updateStatus(bookingId: string, newStatus: string) {
    if (!confirm(`Are you sure you want to mark this job as ${newStatus}?`)) return;

    const token = localStorage.getItem('sf_token');
    if (!token) return;

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    this.http.put(`http://localhost:5000/api/bookings/${bookingId}/status`, { status: newStatus }, { headers }).subscribe({
      next: () => {
        // Optimistically update the UI
        const booking = this.bookings.find(b => b.id === bookingId);
        if (booking) {
          booking.status = newStatus;
        }
      },
      error: (err) => {
        alert('Failed to update status. Please try again.');
        console.error(err);
      }
    });
  }
}

