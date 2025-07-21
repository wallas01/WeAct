import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // --- SSR pages ---
  {
    path: '',
    loadComponent: () =>
      import('./pages/ssr/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'proposte',
    loadComponent: () =>
      import('./pages/ssr/proposte/proposte.component').then(
        (m) => m.ProposteComponent
      ),
  },
  {
    path: 'proposte/:id',
    loadComponent: () =>
      import('./pages/ssr/proposta/proposta.component').then(
        (m) => m.PropostaComponent
      ),
  },
  {
    path: 'conflitti',
    loadComponent: () =>
      import('./pages/ssr/conflitti/conflitti.component').then(
        (m) => m.ConflittiComponent
      ),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/ssr/about/about.component').then((m) => m.AboutComponent),
  },

  // --- CSR pages (lazy loaded routes) ---
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/csr/login/login.routes').then((m) => m.routes),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/csr/register/register.routes').then((m) => m.routes),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/csr/dashboard/dashboard.routes').then((m) => m.routes),
    canActivate: [AuthGuard],
  },
  {
    path: 'partecipa',
    loadChildren: () =>
      import('./pages/csr/partecipa/partecipa.routes').then((m) => m.routes),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
