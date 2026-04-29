import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-invoices',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="invoices-container">
      <h2 style="color: var(--primary); margin-bottom: 25px;">My Invoices</h2>
      
      <div class="admin-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Service</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let inv of invoices">
              <td><strong>{{ inv.id }}</strong></td>
              <td>{{ inv.service }}</td>
              <td>{{ inv.date | date }}</td>
              <td>{{ inv.amount }}</td>
              <td><span class="status-pill success">Paid</span></td>
              <td><button class="btn-text"><i class="fa-solid fa-download"></i> PDF</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .invoices-container { padding: 20px; }
    .status-pill.success { background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
    .btn-text { background: none; border: none; color: var(--accent); cursor: pointer; font-weight: 700; }
  `]
})
export class ClientInvoicesComponent implements OnInit {
  invoices = [
    { id: 'INV-2024-001', service: 'AC Maintenance', date: '2024-04-15', amount: '€150.00' },
    { id: 'INV-2024-002', service: 'Plumbing Repair', date: '2024-04-20', amount: '€85.50' }
  ];
  ngOnInit() {}
}
