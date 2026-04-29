import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/layout.component';
import { AdminOverviewComponent } from './overview/overview.component';
import { ManageUsersComponent } from './users/users.component';
import { ManageBookingsComponent } from './bookings/bookings.component';
import { UaeInquiriesComponent } from './uae-inquiries/uae-inquiries.component';
import { AdminContactsComponent } from './contacts/contacts.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AdminOverviewComponent },
      { path: 'users', component: ManageUsersComponent },
      { path: 'bookings', component: ManageBookingsComponent },
      { path: 'uae-inquiries', component: UaeInquiriesComponent },
      { path: 'messages', component: AdminContactsComponent }
    ]
  }
];
