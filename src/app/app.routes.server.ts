import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'proposte',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'conflitti',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'proposte/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      return [{ id: '1' }, { id: '2' }, { id: '3' }];
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
