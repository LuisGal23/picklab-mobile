import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PicksService } from './services/picks.service';
import { PickTier } from './services/picks.models';

@Component({
  selector: 'app-mobile-picks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#F5F6F8] text-slate-900 pb-24 font-sans select-none">
      
      <!-- Top Bar -->
      <header class="sticky top-0 z-30 bg-[#F5F6F8]/90 backdrop-blur-md px-5 pt-4 pb-3 space-y-3">
        <div>
          <span class="text-xs font-mono font-bold uppercase text-emerald-600 block">Motor Cuantitativo ML</span>
          <h1 class="text-2xl font-black text-slate-950">Picks & Pronósticos</h1>
        </div>

        <!-- Filter Segmented Tabs -->
        <div class="flex items-center p-1 rounded-2xl bg-slate-200/80 border border-slate-300/40 text-xs font-bold">
          <button
            (click)="service.setTier('oficial')"
            [class.bg-white]="service.selectedTier() === 'oficial'"
            [class.text-slate-950]="service.selectedTier() === 'oficial'"
            [class.shadow-sm]="service.selectedTier() === 'oficial'"
            [class.text-slate-600]="service.selectedTier() !== 'oficial'"
            class="flex-1 py-2 rounded-xl transition-all text-center"
          >
            🎯 Oficiales
          </button>
          <button
            (click)="service.setTier('probable')"
            [class.bg-white]="service.selectedTier() === 'probable'"
            [class.text-slate-950]="service.selectedTier() === 'probable'"
            [class.shadow-sm]="service.selectedTier() === 'probable'"
            [class.text-slate-600]="service.selectedTier() !== 'probable'"
            class="flex-1 py-2 rounded-xl transition-all text-center"
          >
            📊 Probables
          </button>
          <button
            (click)="service.setTier('sospechoso')"
            [class.bg-white]="service.selectedTier() === 'sospechoso'"
            [class.text-slate-950]="service.selectedTier() === 'sospechoso'"
            [class.shadow-sm]="service.selectedTier() === 'sospechoso'"
            [class.text-slate-600]="service.selectedTier() !== 'sospechoso'"
            class="flex-1 py-2 rounded-xl transition-all text-center"
          >
            ⚠️ Sospechosos
          </button>
        </div>
      </header>

      <main class="px-5 space-y-3.5 pt-2">
        @for (pick of service.filteredPicks(); track pick.id) {
          <div class="p-4 rounded-3xl bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="px-2.5 py-0.5 rounded-full bg-slate-100 font-mono text-slate-700 font-bold">
                {{ pick.league }}
              </span>
              <span class="font-mono text-slate-500 font-medium">{{ pick.kickoff }}</span>
            </div>

            <div class="text-sm font-black text-slate-900">
              {{ pick.matchTitle }}
            </div>

            <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span class="font-bold text-xs text-slate-800">{{ pick.selection }}</span>
              <span class="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-mono font-black text-xs">
                @ {{ pick.odds.toFixed(2) }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div class="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span class="text-[10px] text-slate-400 block">Probabilidad ML</span>
                <span class="font-bold text-slate-800">{{ pick.probModelPct }}%</span>
              </div>
              <div class="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span class="text-[10px] text-slate-400 block">Ventaja (+EV)</span>
                <span class="font-bold text-emerald-600">+{{ pick.edgePct }}%</span>
              </div>
            </div>

            @if (pick.isSuspicious && pick.suspiciousReason) {
              <div class="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium leading-relaxed">
                {{ pick.suspiciousReason }}
              </div>
            }
          </div>
        }
      </main>

    </div>
  `
})
export class PicksComponent {
  public service = inject(PicksService);
}
