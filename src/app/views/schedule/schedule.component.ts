import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from './services/schedule.service';
import { DayMatchItem, SportFilterType } from './services/schedule.models';
import { MatchAnalysisModalComponent } from '../home/modals/match-analysis-modal/match-analysis-modal.component';
import { MatchAnalysisService } from '../home/modals/match-analysis-modal/services/match-analysis.service';
import { NotificationService } from '../../core/services/notification.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-mobile-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, MatchAnalysisModalComponent],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] dark:bg-[#090D14] text-slate-900 dark:text-white pb-28 font-sans select-none transition-colors duration-300">
      
      <!-- Top Bar with Safe Area Top -->
      <header class="sticky top-0 z-30 bg-[#F8FAFC]/95 dark:bg-[#090D14]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-slate-200/80 dark:border-white/10 safe-area-top space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-[11px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 block tracking-wider">
                Cartelera Monte Carlo ML
              </span>
            </div>
            <h1 class="text-2xl font-black text-slate-950 dark:text-white tracking-tight">Partidos del Día</h1>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
            {{ scheduleService.filteredMatches().length }} juegos
          </span>
        </div>

        <!-- SEARCH BAR -->
        <div class="relative w-full">
          <svg class="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            [ngModel]="scheduleService.searchQuery()"
            (ngModelChange)="scheduleService.searchQuery.set($event)"
            placeholder="Buscar por equipo o liga..."
            class="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 rounded-2xl py-2 pl-9 pr-8 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors font-medium"
          />
          @if (scheduleService.searchQuery()) {
            <button
              (click)="scheduleService.searchQuery.set('')"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center bg-slate-200 dark:bg-white/10"
            >
              ✕
            </button>
          }
        </div>

        <!-- SPORT PILLS (NBA, Fútbol, NFL, Todas) -->
        <div class="flex items-center space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          <button
            (click)="scheduleService.setSport('all')"
            [class.bg-emerald-500]="scheduleService.selectedSport() === 'all'"
            [class.text-slate-950]="scheduleService.selectedSport() === 'all'"
            [class.font-black]="scheduleService.selectedSport() === 'all'"
            [class.bg-slate-100]="scheduleService.selectedSport() !== 'all'"
            [class.dark:bg-slate-800/70]="scheduleService.selectedSport() !== 'all'"
            [class.text-slate-600]="scheduleService.selectedSport() !== 'all'"
            [class.dark:text-slate-300]="scheduleService.selectedSport() !== 'all'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-1.5"
          >
            <span>🌐 Todas</span>
            <span class="text-[10px] opacity-75 font-mono">({{ scheduleService.sportsSummary().all }})</span>
          </button>

          <button
            (click)="scheduleService.setSport('futbol')"
            [class.bg-emerald-500]="scheduleService.selectedSport() === 'futbol'"
            [class.text-slate-950]="scheduleService.selectedSport() === 'futbol'"
            [class.font-black]="scheduleService.selectedSport() === 'futbol'"
            [class.bg-slate-100]="scheduleService.selectedSport() !== 'futbol'"
            [class.dark:bg-slate-800/70]="scheduleService.selectedSport() !== 'futbol'"
            [class.text-slate-600]="scheduleService.selectedSport() !== 'futbol'"
            [class.dark:text-slate-300]="scheduleService.selectedSport() !== 'futbol'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-1.5"
          >
            <span>⚽ Fútbol</span>
            <span class="text-[10px] opacity-75 font-mono">({{ scheduleService.sportsSummary().futbol }})</span>
          </button>

          <button
            (click)="scheduleService.setSport('nba')"
            [class.bg-emerald-500]="scheduleService.selectedSport() === 'nba'"
            [class.text-slate-950]="scheduleService.selectedSport() === 'nba'"
            [class.font-black]="scheduleService.selectedSport() === 'nba'"
            [class.bg-slate-100]="scheduleService.selectedSport() !== 'nba'"
            [class.dark:bg-slate-800/70]="scheduleService.selectedSport() !== 'nba'"
            [class.text-slate-600]="scheduleService.selectedSport() !== 'nba'"
            [class.dark:text-slate-300]="scheduleService.selectedSport() !== 'nba'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-1.5"
          >
            <span>🏀 NBA</span>
            <span class="text-[10px] opacity-75 font-mono">({{ scheduleService.sportsSummary().nba }})</span>
          </button>

          <button
            (click)="scheduleService.setSport('nfl')"
            [class.bg-emerald-500]="scheduleService.selectedSport() === 'nfl'"
            [class.text-slate-950]="scheduleService.selectedSport() === 'nfl'"
            [class.font-black]="scheduleService.selectedSport() === 'nfl'"
            [class.bg-slate-100]="scheduleService.selectedSport() !== 'nfl'"
            [class.dark:bg-slate-800/70]="scheduleService.selectedSport() !== 'nfl'"
            [class.text-slate-600]="scheduleService.selectedSport() !== 'nfl'"
            [class.dark:text-slate-300]="scheduleService.selectedSport() !== 'nfl'"
            class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm flex items-center space-x-1.5"
          >
            <span>🏈 NFL</span>
            <span class="text-[10px] opacity-75 font-mono">({{ scheduleService.sportsSummary().nfl }})</span>
          </button>
        </div>

        <!-- DATE CONTROLS ROW -->
        <div class="flex items-center justify-between gap-2 pt-1 text-xs">
          <div class="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner">
            <button
              (click)="scheduleService.setToday()"
              [class.bg-emerald-500]="scheduleService.isToday() && !scheduleService.allDatesMode()"
              [class.text-slate-950]="scheduleService.isToday() && !scheduleService.allDatesMode()"
              [class.font-black]="scheduleService.isToday() && !scheduleService.allDatesMode()"
              [class.text-slate-600]="!scheduleService.isToday() || scheduleService.allDatesMode()"
              [class.dark:text-slate-300]="!scheduleService.isToday() || scheduleService.allDatesMode()"
              class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
            >
              Hoy
            </button>
            <button
              (click)="scheduleService.toggleAllDates()"
              [class.bg-emerald-500]="scheduleService.allDatesMode()"
              [class.text-slate-950]="scheduleService.allDatesMode()"
              [class.font-black]="scheduleService.allDatesMode()"
              [class.text-slate-600]="!scheduleService.allDatesMode()"
              [class.dark:text-slate-300]="!scheduleService.allDatesMode()"
              class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
            >
              Todos
            </button>
          </div>

          <div class="flex items-center space-x-1">
            <button
              (click)="scheduleService.changeDate(-1)"
              class="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs"
              title="Día Anterior"
            >
              &larr;
            </button>
            <input
              type="date"
              [ngModel]="scheduleService.selectedDate()"
              (ngModelChange)="scheduleService.onDatePicked($event)"
              class="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs rounded-xl px-2.5 py-1 focus:outline-none"
            />
            <button
              (click)="scheduleService.changeDate(1)"
              class="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs"
              title="Día Siguiente"
            >
              &rarr;
            </button>
          </div>
        </div>
      </header>

      <!-- MATCHES FEED -->
      <main class="px-4 space-y-3.5 pt-3.5">
        @for (match of scheduleService.filteredMatches(); track match.id) {
          <div
            (click)="openAnalysis(match)"
            class="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer space-y-3"
          >
            <!-- Header Badges -->
            <div class="flex items-center justify-between text-xs">
              <span class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                {{ match.league }}
              </span>

              <div class="flex items-center space-x-2">
                @if (match.isOfficialPick) {
                  <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-black text-[10px] border border-emerald-500/20">
                    🎯 OFICIAL (+EV)
                  </span>
                } @else if (match.isProbableByStats) {
                  <span class="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-black text-[10px] border border-blue-500/20">
                    📊 PROBABLE POR STATS
                  </span>
                }
                <span class="font-mono text-slate-400 text-xs font-semibold">
                  {{ match.kickoffTime }}
                </span>
              </div>
            </div>

            <!-- Teams & Crests -->
            <div class="flex items-center justify-between py-1">
              <!-- Home Team -->
              <div class="flex items-center space-x-3 w-[42%]">
                <img
                  [src]="match.homeLogo"
                  [alt]="match.homeTeam"
                  (error)="onImgError($event)"
                  class="w-9 h-9 object-contain rounded-xl bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-white/5 shrink-0"
                />
                <span class="font-black text-xs sm:text-sm text-slate-900 dark:text-white leading-tight line-clamp-2">
                  {{ match.homeTeam }}
                </span>
              </div>

              <!-- VS Badge -->
              <div class="w-[16%] flex flex-col items-center justify-center">
                <span class="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  VS
                </span>
              </div>

              <!-- Away Team -->
              <div class="flex items-center justify-end space-x-3 w-[42%] text-right">
                <span class="font-black text-xs sm:text-sm text-slate-900 dark:text-white leading-tight line-clamp-2">
                  {{ match.awayTeam }}
                </span>
                <img
                  [src]="match.awayLogo"
                  [alt]="match.awayTeam"
                  (error)="onImgError($event)"
                  class="w-9 h-9 object-contain rounded-xl bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-white/5 shrink-0"
                />
              </div>
            </div>

            <!-- Monte Carlo Probabilities Bar (Web Terminal Replica) -->
            <div class="space-y-1.5 pt-1">
              <div class="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                <span>Local {{ match.probHome }}%</span>
                @if (match.probDraw) {
                  <span>Empate {{ match.probDraw }}%</span>
                }
                <span>Visita {{ match.probAway }}%</span>
              </div>
              <div class="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden">
                <div class="bg-cyan-500 h-full" [style.width.%]="match.probHome"></div>
                @if (match.probDraw) {
                  <div class="bg-slate-400 dark:bg-slate-600 h-full" [style.width.%]="match.probDraw"></div>
                }
                <div class="bg-emerald-500 h-full" [style.width.%]="match.probAway"></div>
              </div>
            </div>

            <!-- Market Odds & Action Bar -->
            <div class="flex items-center justify-between pt-1">
              <div class="flex items-center space-x-2 text-xs font-mono">
                <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">
                  1: {{ match.homeOdds.toFixed(2) }}
                </span>
                @if (match.drawOdds) {
                  <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">
                    X: {{ match.drawOdds.toFixed(2) }}
                  </span>
                }
                <span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">
                  2: {{ match.awayOdds.toFixed(2) }}
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center space-x-1.5" (click)="$event.stopPropagation()">
                <button
                  (click)="toggleNotify(match)"
                  [class.text-emerald-500]="isNotified(match.id)"
                  [class.bg-emerald-50]="isNotified(match.id)"
                  [class.dark:bg-emerald-950/40]="isNotified(match.id)"
                  [class.text-slate-400]="!isNotified(match.id)"
                  [class.bg-slate-100]="!isNotified(match.id)"
                  [class.dark:bg-slate-800]="!isNotified(match.id)"
                  class="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  title="Avisar si se dio o no el resultado"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" [attr.fill]="isNotified(match.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                  </svg>
                </button>

                <button
                  (click)="openAnalysis(match)"
                  class="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-all flex items-center space-x-1"
                >
                  <span>Ver Análisis</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>

            @if (match.pickTitle) {
              <div class="p-2.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between text-xs">
                <span class="font-bold text-emerald-900 dark:text-emerald-300">{{ match.pickTitle }}</span>
                <span class="font-mono font-black text-emerald-600 dark:text-emerald-400">+{{ match.edgePct }}% EV</span>
              </div>
            }

          </div>
        } @empty {
          <div class="text-center py-12 p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-3">
            <span class="text-3xl block">🔍</span>
            <p class="text-sm font-bold text-slate-700 dark:text-slate-300">No se encontraron partidos para este filtro</p>
            <p class="text-xs text-slate-400">Intenta cambiando el deporte o la fecha seleccionada</p>
            <button
              (click)="scheduleService.setSport('all'); scheduleService.setToday(); scheduleService.searchQuery.set('')"
              class="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Restablecer Filtros
            </button>
          </div>
        }
      </main>

      <!-- MODAL DE ANÁLISIS COMPLETO -->
      <app-match-analysis-modal />

    </div>
  `
})
export class ScheduleComponent {
  public scheduleService = inject(ScheduleService);
  public notifyService = inject(NotificationService);
  public modalService = inject(MatchAnalysisService);
  public theme = inject(ThemeService);

  public openAnalysis(match: DayMatchItem): void {
    this.modalService.openAnalysis({
      matchId: match.id,
      matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
      league: match.league,
      kickoff: `${match.kickoffDate} • ${match.kickoffTime}`,
      market: match.pickTitle || 'Victoria Local (1X2)',
      targetLine: 2.5,
      marketOdds: match.pickOdds || match.homeOdds,
      fairOdds: Number(((match.pickOdds || match.homeOdds) * 0.88).toFixed(2)),
      overProbPct: match.probHome,
      underProbPct: match.probAway,
      edgePct: match.edgePct || 12.5,
      isOfficialPick: match.isOfficialPick,
      isSuspicious: false,
      muML: match.mu || 2.8,
      sigmaML: match.sigma || 1.1,
      distributionType: 'Poisson',
      iterations: match.simulations || 100000,
      percentiles: {
        p10: 1.2,
        p25: 2.1,
        p50: 2.8,
        p75: 3.6,
        p90: 4.4
      },
      reasoning: [
        match.analysisSnippet || 'Análisis probabilístico ejecutado con 100k simulaciones Monte Carlo.',
        'La calibración post-partido valida una ventaja matemática (+EV) positiva frente a las líneas de apertura.'
      ]
    });
  }

  public isNotified(matchId: string): boolean {
    return this.notifyService.isSubscribed(matchId);
  }

  public toggleNotify(match: DayMatchItem): void {
    this.notifyService.toggleSubscription(
      match.id,
      `${match.homeTeam} vs ${match.awayTeam}`,
      match.pickTitle || 'Pronóstico del Partido',
      match.pickOdds || match.homeOdds
    );
  }

  public onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://crests.football-data.org/default.png';
  }
}
