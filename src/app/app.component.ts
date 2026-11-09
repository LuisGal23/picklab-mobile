import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { BottomNavComponent } from './shared/components/bottom-nav/bottom-nav.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, BottomNavComponent],
  template: `
    <div class="relative min-h-screen bg-[#F5F6F8] text-slate-900 antialiased overflow-x-hidden">
      <router-outlet />
      @if (showBottomNav) {
        <app-mobile-bottom-nav />
      }
    </div>
  `
})
export class AppComponent {
  private router = inject(Router);
  public showBottomNav = false;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.showBottomNav = !url.includes('/login') && url !== '/' && url !== '';
    });
  }
}
