import { Injectable, signal } from '@angular/core';
import { NavTabItem } from './bottom-nav.models';

@Injectable({
  providedIn: 'root'
})
export class BottomNavService {
  private tabs = signal<NavTabItem[]>([
    { id: 'home', label: 'Inicio', route: '/home', icon: 'home' },
    { id: 'schedule', label: 'Partidos', route: '/schedule', icon: 'calendar' },
    { id: 'picks', label: 'Picks', route: '/picks', icon: 'flame' },
    { id: 'audit', label: 'Auditoría', route: '/audit', icon: 'shield' },
    { id: 'settings', label: 'Ajustes', route: '/settings', icon: 'settings' }
  ]);

  public getTabs() {
    return this.tabs.asReadonly();
  }
}
