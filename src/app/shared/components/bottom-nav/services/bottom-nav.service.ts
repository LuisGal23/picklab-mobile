import { Injectable, signal } from '@angular/core';
import { NavTabItem } from './bottom-nav.models';

@Injectable({
  providedIn: 'root'
})
export class BottomNavService {
  private tabs = signal<NavTabItem[]>([
    { id: 'home', label: 'Home', route: '/home', icon: 'home' },
    { id: 'schedule', label: 'Schedule', route: '/schedule', icon: 'calendar' },
    { id: 'picks', label: 'Picks', route: '/picks', icon: 'flame' },
    { id: 'follows', label: 'Follows', route: '/follows', icon: 'heart' },
    { id: 'bankroll', label: 'Bankroll', route: '/bankroll', icon: 'wallet' }
  ]);

  public getTabs() {
    return this.tabs.asReadonly();
  }
}
