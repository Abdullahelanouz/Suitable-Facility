import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../core/guards/auth-guard';

export const PORTUGAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then(m => m.LandingComponent)
  },
  {
    path: 'services',
    loadComponent: () => import('./pages/services/services').then(m => m.ServicesComponent)
  },
  {
    path: 'technicians',
    loadComponent: () => import('./pages/technicians/technicians').then(m => m.TechniciansComponent)
  },
  {
    path: 'dashboard/client',
    loadComponent: () => import('./pages/client-dashboard/client-dashboard').then(m => m.ClientDashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'requests',
        loadComponent: () => import('./pages/client-dashboard/requests/requests.component').then(m => m.ClientRequestsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/client-dashboard/settings/settings.component').then(m => m.ClientSettingsComponent)
      },
      {
        path: 'invoices',
        loadComponent: () => import('./pages/client-dashboard/invoices/invoices.component').then(m => m.ClientInvoicesComponent)
      }
    ]
  },
  {
    path: 'dashboard/tech',
    loadComponent: () => import('./pages/tech-dashboard/tech-dashboard').then(m => m.TechDashboardComponent),
    canActivate: [roleGuard(['Technician', 'Admin'])],
    children: [
      {
        path: 'history',
        loadComponent: () => import('./pages/tech-dashboard/history/history.component').then(m => m.TechHistoryComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/tech-dashboard/settings/settings.component').then(m => m.TechSettingsComponent)
      }
    ]
  },
];
