import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PicksService } from './services/picks.service';
import { MobilePickItem } from './services/picks.models';
import { MatchAnalysisModalComponent } from '../home/modals/match-analysis-modal/match-analysis-modal.component';
import { MatchAnalysisService } from '../home/modals/match-analysis-modal/services/match-analysis.service';
import { NotificationService } from '../../core/services/notification.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-mobile-picks',
  standalone: true,
  imports: [CommonModule, MatchAnalysisModalComponent],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] dark:bg-[#060a12] text-slate-900 dark:text-white pb-28 font-sans select-none transition-colors duration-300">
      
      <!-- Top Bar with Safe Area Top -->
      <header class="sticky top-0 z-30 bg-[#F8FAFC]/95 dark:bg-[#060a12]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-slate-200/80 dark:border-white/10 safe-area-top space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-[11px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 block tracking-wider">
                Motor Cuantitativo ML
              </span>
            </div>
            <h1 class="text-2xl font-black text-slate-950 dark:text-white tracking-tight">Picks & Pronósticos</h1>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
            {{ service.filteredPicks().length }} picks
          </span>
        </div>

        <!-- Filter Segmented Tabs (Oficiales vs Probables vs Sospechosos) -->
        <div class="flex items-center p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/40 dark:border-white/5 text-xs font-bold">
          <button
            (click)="service.setTier('oficial')"
            [class.bg-white]="service.selectedTier() === 'oficial'"
            [class.dark:bg-slate-900]="service.selectedTier() === 'oficial'"
            [class.text-slate-950]="service.selectedTier() === 'oficial'"
            [class.dark:text-white]="service.selectedTier() === 'oficial'"
            [class.shadow-sm]="service.selectedTier() === 'oficial'"
            [class.text-slate-600]="service.selectedTier() !== 'oficial'"
            [class.dark:text-slate-400]="service.selectedTier() !== 'oficial'"
            class="flex-1 py-1.5 rounded-xl transition-all text-center flex items-center justify-center space-x-1"
          >
            <span>🎯</span>
            <span>Oficiales (+EV)</span>
          </button>

          <button
            (click)="service.setTier('probable')"
            [class.bg-white]="service.selectedTier() === 'probable'"
            [class.dark:bg-slate-900]="service.selectedTier() === 'probable'"
            [class.text-slate-950]="service.selectedTier() === 'probable'"
            [class.dark:text-white]="service.selectedTier() === 'probable'"
            [class.shadow-sm]="service.selectedTier() === 'probable'"
            [class.text-slate-600]="service.selectedTier() !== 'probable'"
            [class.dark:text-slate-400]="service.selectedTier() !== 'probable'"
            class="flex-1 py-1.5 rounded-xl transition-all text-center flex items-center justify-center space-x-1"
          >
            <span>📊</span>
            <span>Probables</span>
          </button>

          <button
            (click)="service.setTier('sospechoso')"
            [class.bg-white]="service.selectedTier() === 'sospechoso'"
            [class.dark:bg-slate-900]="service.selectedTier() === 'sospechoso'"
            [class.text-slate-950]="service.selectedTier() === 'sospechoso'"
            [class.dark:text-white]="service.selectedTier() === 'sospechoso'"
            [class.shadow-sm]="service.selectedTier() === 'sospechoso'"
            [class.text-slate-600]="service.selectedTier() !== 'sospechoso'"
            [class.dark:text-slate-400]="service.selectedTier() !== 'sospechoso'"
            class="flex-1 py-1.5 rounded-xl transition-all text-center flex items-center justify-center space-x-1"
          >
            <span>⚠️</span>
            <span>Sospechosos</span>
          </button>
        </div>

        <!-- Sport Sub-Filters -->
        <div class="flex items-center space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          <button
            (click)="service.setSport('all')"
            [class.bg-emerald-500]="service.selectedSport() === 'all'"
            [class.text-slate-950]="service.selectedSport() === 'all'"
            [class.font-black]="service.selectedSport() === 'all'"
            [class.bg-slate-100]="service.selectedSport() !== 'all'"
            [class.dark:bg-slate-800/70]="service.selectedSport() !== 'all'"
            [class.text-slate-600]="service.selectedSport() !== 'all'"
            [class.dark:text-slate-300]="service.selectedSport() !== 'all'"
            class="px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm"
          >
            🌐 Todas
          </button>

          <button
            (click)="service.setSport('soccer')"
            [class.bg-emerald-500]="service.selectedSport() === 'soccer'"
            [class.text-slate-950]="service.selectedSport() === 'soccer'"
            [class.font-black]="service.selectedSport() === 'soccer'"
            [class.bg-slate-100]="service.selectedSport() !== 'soccer'"
            [class.dark:bg-slate-800/70]="service.selectedSport() !== 'soccer'"
            [class.text-slate-600]="service.selectedSport() !== 'soccer'"
            [class.dark:text-slate-300]="service.selectedSport() !== 'soccer'"
            class="px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm"
          >
            ⚽ Fútbol
          </button>

          <button
            (click)="service.setSport('nba')"
            [class.bg-emerald-500]="service.selectedSport() === 'nba'"
            [class.text-slate-950]="service.selectedSport() === 'nba'"
            [class.font-black]="service.selectedSport() === 'nba'"
            [class.bg-slate-100]="service.selectedSport() !== 'nba'"
            [class.dark:bg-slate-800/70]="service.selectedSport() !== 'nba'"
            [class.text-slate-600]="service.selectedSport() !== 'nba'"
            [class.dark:text-slate-300]="service.selectedSport() !== 'nba'"
            class="px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm"
          >
            🏀 NBA
          </button>
        </div>
      </header>

      <!-- PICKS FEED -->
      <main class="px-4 space-y-3.5 pt-3.5">
        @for (pick of service.filteredPicks(); track pick.id) {
          <div
            (click)="openAnalysis(pick)"
            class="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer space-y-3"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                {{ pick.league }}
              </span>
              <span class="font-mono text-slate-400 font-medium text-xs">{{ pick.kickoff }}</span>
            </div>

            <!-- Teams & Crests -->
            <div class="flex items-center justify-between py-1">
              <div class="flex items-center space-x-2.5">
                <img [src]="pick.homeLogo" class="w-7 h-7 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 p-0.5" />
                <span class="font-black text-xs sm:text-sm text-slate-900 dark:text-white">{{ pick.homeTeam }}</span>
              </div>
              <span class="text-xs font-mono font-bold text-slate-400">vs</span>
              <div class="flex items-center space-x-2.5 text-right">
                <span class="font-black text-xs sm:text-sm text-slate-900 dark:text-white">{{ pick.awayTeam }}</span>
                <img [src]="pick.awayLogo" class="w-7 h-7 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 p-0.5" />
              </div>
            </div>

            <!-- Selection Card -->
            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <span class="text-[10px] uppercase font-mono text-slate-400 block font-bold">Selección Recomendada</span>
                <span class="font-black text-xs text-slate-900 dark:text-white">{{ pick.selection }}</span>
              </div>
              <span class="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-black text-xs border border-emerald-500/20">
                @ {{ pick.odds.toFixed(2) }}
              </span>
            </div>

            <!-- Metrics Grid -->
            <div class="grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div class="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5">
                <span class="text-[10px] text-slate-400 block font-bold">Probabilidad Monte Carlo</span>
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ pick.probModelPct }}%</span>
              </div>
              <div class="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5">
                <span class="text-[10px] text-slate-400 block font-bold">Ventaja Matemática</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">+{{ pick.edgePct }}% EV</span>
              </div>
            </div>

            @if (pick.isSuspicious && pick.suspiciousReason) {
              <div class="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-medium leading-relaxed">
                {{ pick.suspiciousReason }}
              </div>
            }

            <!-- Bottom Actions -->
            <div class="flex items-center justify-between pt-1" (click)="$event.stopPropagation()">
              <button
                (click)="toggleNotify(pick)"
                [class.text-emerald-500]="isNotified(pick.id)"
                [class.bg-emerald-50]="isNotified(pick.id)"
                [class.dark:bg-emerald-950/40]="isNotified(pick.id)"
                [class.text-slate-400]="!isNotified(pick.id)"
                [class.bg-slate-100]="!isNotified(pick.id)"
                [class.dark:bg-slate-800]="!isNotified(pick.id)"
                class="px-3 py-1.5 rounded-xl flex items-center space-x-1.5 text-xs font-bold transition-all hover:scale-105 active:scale-95"
              >
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" [attr.fill]="isNotified(pick.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                </svg>
                <span>{{ isNotified(pick.id) ? 'Notificando' : 'Avisar Resultado' }}</span>
              </button>

              <button
                (click)="openAnalysis(pick)"
                class="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-all flex items-center space-x-1"
              >
                <span>Análisis & Jugadores</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        }
      </main>

      <!-- MODAL DE ANÁLISIS -->
      <app-match-analysis-modal />

    </div>
  `
})
export class PicksComponent {
  public service = inject(PicksService);
  public notifyService = inject(NotificationService);
  public modalService = inject(MatchAnalysisService);
  public theme = inject(ThemeService);

  public openAnalysis(pick: MobilePickItem): void {
    this.modalService.openAnalysis({
      matchId: pick.id,
      matchTitle: `${pick.homeTeam} vs ${pick.awayTeam}`,
      league: pick.league,
      kickoff: pick.kickoff,
      market: pick.selection,
      targetLine: 2.5,
      marketOdds: pick.odds,
      fairOdds: Number((pick.odds * (1 - pick.edgePct / 100)).toFixed(2)),
      overProbPct: pick.probModelPct,
      underProbPct: 100 - pick.probModelPct,
      edgePct: pick.edgePct,
      isOfficialPick: pick.tier === 'oficial',
      isSuspicious: pick.isSuspicious,
      muML: pick.mu,
      sigmaML: pick.sigma,
      distributionType: 'Normal',
      iterations: pick.simulations,
      percentiles: {
        p10: 1.5,
        p25: 2.2,
        p50: pick.mu,
        p75: 3.5,
        p90: 4.2
      },
      reasoning: [
        pick.analysisSnippet,
        `Ventaja matemática (+EV) calculada en +${pick.edgePct}% contra la línea de cierre.`
      ]
    }, pick.id, pick.sport, pick.league);
  }

  public isNotified(pickId: string): boolean {
    return this.notifyService.isSubscribed(pickId);
  }

  public toggleNotify(pick: MobilePickItem): void {
    this.notifyService.toggleSubscription(
      pick.id,
      `${pick.homeTeam} vs ${pick.awayTeam}`,
      pick.selection,
      pick.odds
    );
  }
}
