import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/splash/splash.component').then(m => m.SplashComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./views/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./views/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'schedule',
    loadComponent: () => import('./views/schedule/schedule.component').then(m => m.ScheduleComponent)
  },
  {
    path: 'picks',
    loadComponent: () => import('./views/picks/picks.component').then(m => m.PicksComponent)
  },
  {
    path: 'audit',
    loadComponent: () => import('./views/audit/audit.component').then(m => m.AuditComponent)
  },
  {
    path: 'jugador/:id',
    loadComponent: () => import('./views/player-profile/player-profile.component').then(m => m.PlayerProfileComponent)
  },
  {
    path: 'player/:id',
    redirectTo: 'jugador/:id'
  },
  {
    path: 'follows',
    redirectTo: 'audit'
  },
  {
    path: 'settings',
    loadComponent: () => import('./views/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'bankroll',
    redirectTo: 'settings'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
