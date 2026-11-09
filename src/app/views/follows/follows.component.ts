import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FollowsService } from './services/follows.service';

@Component({
  selector: 'app-mobile-follows',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#F5F6F8] text-slate-900 pb-24 font-sans select-none">
      
      <!-- Top Bar -->
      <header class="sticky top-0 z-30 bg-[#F5F6F8]/90 backdrop-blur-md px-5 pt-4 pb-3 flex items-center justify-between">
        <div>
          <span class="text-xs font-mono font-bold uppercase text-emerald-600 block">Tus Favoritos</span>
          <h1 class="text-2xl font-black text-slate-950">Equipos & Ligas</h1>
        </div>
      </header>

      <main class="px-5 space-y-3.5 pt-2">
        @for (item of follows(); track item.id) {
          <div class="p-4 rounded-3xl bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-between">
            <div class="space-y-1">
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-mono font-bold uppercase text-slate-600">
                  {{ item.type }}
                </span>
                <span class="text-xs font-bold text-slate-500">{{ item.sport }}</span>
              </div>
              <h2 class="text-base font-black text-slate-900">{{ item.name }}</h2>
              <p class="text-xs text-slate-500">{{ item.nextMatch }}</p>
            </div>

            <div class="text-right space-y-1">
              <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs font-mono block">
                {{ item.activePicksCount }} picks
              </span>
              <button class="text-xs text-red-500 font-bold">Siguiendo</button>
            </div>
          </div>
        }
      </main>

    </div>
  `
})
export class FollowsComponent {
  private service = inject(FollowsService);
  public follows = this.service.getFollows();
}
