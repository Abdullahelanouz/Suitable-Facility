import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth-guard';
import { HomeComponent } from './features/home/home';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'portugal',
    loadChildren: () => import('./features/portugal/portugal-routing-module').then(m => m.PORTUGAL_ROUTES)
  },

  {
    path: 'uae',
    loadChildren: () => import('./features/uae/uae-module').then(m => m.UaeModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [roleGuard(['Admin'])]
  }
];

