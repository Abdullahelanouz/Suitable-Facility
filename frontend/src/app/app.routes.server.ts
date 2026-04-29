import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static pages — pre-render at build time for SEO
  {
    path: 'portugal',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'uae',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'portugal/services',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'portugal/technicians',
    renderMode: RenderMode.Prerender
  },
  // Auth pages — server-side render (personalized)
  {
    path: 'auth/login',
    renderMode: RenderMode.Server
  },
  {
    path: 'auth/register',
    renderMode: RenderMode.Server
  },
  // Dashboard pages — client-only (require auth, not for crawlers)
  {
    path: 'portugal/dashboard/client',
    renderMode: RenderMode.Client
  },
  {
    path: 'portugal/dashboard/tech',
    renderMode: RenderMode.Client
  },
  // Fallback — server render everything else
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
