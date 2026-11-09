import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BottomNavService } from './services/bottom-nav.service';

@Component({
  selector: 'app-mobile-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#090D14]/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-white/10 px-3 py-2 safe-area-bottom shadow-lg transition-colors duration-300">
      <div class="max-w-md mx-auto flex items-center justify-around">
        @for (tab of tabs(); track tab.id) {
          <a
            [routerLink]="tab.route"
            routerLinkActive="text-emerald-600 dark:text-emerald-400 font-black"
            [routerLinkActiveOptions]="{ exact: false }"
            #rla="routerLinkActive"
            class="flex flex-col items-center justify-center py-1 px-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all select-none"
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
                  <path d="m9 16 2 2 4-4"/>
                </svg>
              } @else if (tab.id === 'picks') {
                <svg class="w-5 h-5" viewBox="0 0 24 24" [attr.fill]="rla.isActive ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                </svg>
              } @else if (tab.id === 'audit') {
                <svg class="w-5 h-5" viewBox="0 0 24 24" [attr.fill]="rla.isActive ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
              } @else if (tab.id === 'settings') {
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              }
            </div>
            <span
              class="text-[10px] mt-1 tracking-tight"
              [class.text-emerald-600]="rla.isActive"
              [class.dark:text-emerald-400]="rla.isActive"
              [class.font-black]="rla.isActive"
            >
              {{ tab.label }}
            </span>
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
