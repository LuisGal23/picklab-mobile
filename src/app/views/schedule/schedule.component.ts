import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleService } from './services/schedule.service';

@Component({
  selector: 'app-mobile-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#F5F6F8] text-slate-900 pb-24 font-sans select-none">
      
      <!-- Top Bar -->
      <header class="sticky top-0 z-30 bg-[#F5F6F8]/90 backdrop-blur-md px-5 pt-4 pb-3 flex items-center justify-between">
        <div>
          <span class="text-xs font-mono font-bold uppercase text-emerald-600 block">Cartelera Oficial</span>
          <h1 class="text-2xl font-black text-slate-950">Calendario de Partidos</h1>
        </div>
      </header>

      <main class="px-5 space-y-6 pt-2">
        @for (day of schedule(); track day.dateLabel) {
          <section class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-black text-slate-900 flex items-center space-x-2">
                @if (day.isToday) {
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                }
                <span>{{ day.dateLabel }}</span>
              </span>
              <span class="text-xs font-mono text-slate-400">{{ day.matches.length }} partidos</span>
            </div>

            <div class="space-y-3">
              @for (match of day.matches; track match.id) {
                <div class="p-4 rounded-3xl bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3">
                  <div class="flex items-center justify-between text-xs">
                    <span class="px-2.5 py-0.5 rounded-full bg-slate-100 font-mono text-slate-700 font-bold">
                      {{ match.league }}
                    </span>
                    <span class="font-mono text-slate-500 font-semibold">{{ match.timeCdmx }} CDMX</span>
                  </div>

                  <div class="flex items-center justify-between font-black text-slate-900 text-sm">
                    <span>{{ match.homeTeam }}</span>
                    <span class="text-slate-400 font-normal text-xs font-mono">VS</span>
                    <span>{{ match.awayTeam }}</span>
                  </div>

                  <!-- Odds Bar -->
                  <div class="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
                    <div class="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span class="text-[10px] text-slate-400 block">1 (Local)</span>
                      <span class="font-bold text-slate-900">@ {{ match.homeOdds.toFixed(2) }}</span>
                    </div>
                    @if (match.drawOdds) {
                      <div class="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span class="text-[10px] text-slate-400 block">X (Empate)</span>
                        <span class="font-bold text-slate-900">@ {{ match.drawOdds.toFixed(2) }}</span>
                      </div>
                    } @else {
                      <div class="p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <span class="text-[10px] text-slate-400 block">Prob. Local</span>
                        <span class="font-bold text-emerald-600">{{ match.modelProbHome }}%</span>
                      </div>
                    }
                    <div class="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span class="text-[10px] text-slate-400 block">2 (Visita)</span>
                      <span class="font-bold text-slate-900">@ {{ match.awayOdds.toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </section>
        }
      </main>

    </div>
  `
})
export class ScheduleComponent {
  private scheduleService = inject(ScheduleService);
  public schedule = this.scheduleService.getSchedule();
}
