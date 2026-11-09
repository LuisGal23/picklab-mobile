import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BottomNavService } from './services/bottom-nav.service';

@Component({
  selector: 'app-mobile-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-4 py-2 safe-area-bottom shadow-lg">
      <div class="max-w-md mx-auto flex items-center justify-around">
        @for (tab of tabs(); track tab.id) {
          <a
            [routerLink]="tab.route"
            routerLinkActive="text-slate-950 font-bold"
            [routerLinkActiveOptions]="{ exact: false }"
            #rla="routerLinkActive"
            class="flex flex-col items-center justify-center py-1 px-3 text-slate-400 hover:text-slate-800 transition-colors"
          >
            <!-- Icons -->
            <div [class.scale-110]="rla.isActive" class="transition-transform duration-200">
              @if (tab.id === 'home') {
                <svg class="w-5 h-5" viewBox="0 0 24 24" [attr.fill]="rla.isActive ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              } @else if (tab.id === 'schedule') {
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                  <line x1="16" x2="16" y1="2" y2="6"/>
                  <line x1="8" x2="8" y1="2" y2="6"/>
                  <line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
              } @else if (tab.id === 'picks') {
                <svg class="w-5 h-5" viewBox="0 0 24 24" [attr.fill]="rla.isActive ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                </svg>
              } @else if (tab.id === 'follows') {
                <svg class="w-5 h-5" viewBox="0 0 24 24" [attr.fill]="rla.isActive ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              } @else if (tab.id === 'bankroll') {
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a8 8 0 0 1-8 8H6a2 2 0 0 1-2-2V7"/>
                  <circle cx="18" cy="14" r="1"/>
                </svg>
              }
            </div>
            <span class="text-[10px] mt-1 font-medium tracking-tight" [class.text-slate-950]="rla.isActive">{{ tab.label }}</span>
          </a>
        }
      </div>
    </nav>
  `
})
export class BottomNavComponent {
  private navService = inject(BottomNavService);
  public tabs = this.navService.getTabs();
}
