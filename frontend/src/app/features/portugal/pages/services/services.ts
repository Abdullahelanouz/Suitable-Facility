import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class ServicesComponent implements OnInit {
  private readonly API = 'http://localhost:5000/api';

  services: any[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const iconMap: any = {
      'HVAC': 'fa-snowflake',
      'Plumbing': 'fa-faucet-drip',
      'Electrical': 'fa-bolt',
      'Interior': 'fa-trowel-bricks',
      'Cleaning': 'fa-broom',
      'Furniture': 'fa-chair',
      'Outdoor': 'fa-tree'
    };

    this.http.get<any[]>(`${this.API}/auth/services`).subscribe({
      next: (res) => {
        this.services = res.map(s => ({
          ...s,
          icon: iconMap[s.category] || 'fa-tools',
          techsCount: s.techsCount ?? 0
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load services', err);
        this.isLoading = false;
      }
    });
  }
}
