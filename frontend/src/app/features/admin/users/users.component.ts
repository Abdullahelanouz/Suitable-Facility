import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  isLoading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.apiService.getAdminUsers().subscribe({
      next: (res: any) => {
        this.users = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.isLoading = false;
      }
    });
  }

  deleteUser(id: number) {
    if(confirm('Are you sure you want to delete this user?')) {
      // Logic for delete will go here once API is ready
      console.log('Delete user', id);
    }
  }
}
