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
    path: 'follows',
    loadComponent: () => import('./views/follows/follows.component').then(m => m.FollowsComponent)
  },
  {
    path: 'bankroll',
    loadComponent: () => import('./views/bankroll/bankroll.component').then(m => m.BankrollComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
