import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from './services/audit.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-mobile-audit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] dark:bg-[#090D14] text-slate-900 dark:text-white pb-28 font-sans select-none transition-colors duration-300">
      
      <!-- Top Bar with Safe Area Top -->
      <header class="sticky top-0 z-30 bg-[#F8FAFC]/95 dark:bg-[#090D14]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-slate-200/80 dark:border-white/10 safe-area-top space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              <span class="text-[11px] font-mono font-bold uppercase text-cyan-600 dark:text-cyan-400 block tracking-wider">
                Auditoría Inmutable SHA-256
              </span>
            </div>
            <h1 class="text-2xl font-black text-slate-950 dark:text-white tracking-tight">Auditoría e Historial</h1>
          </div>

          <button
            (click)="auditService.triggerSync()"
            [disabled]="auditService.syncing()"
            class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 active:scale-95 text-slate-950 font-black text-[11px] transition-all shadow-md flex items-center space-x-1.5 shrink-0 disabled:opacity-50"
          >
            @if (auditService.syncing()) {
              <span class="w-3 h-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              <span>Auditando...</span>
            } @else {
              <span>⚡</span>
              <span>Verificar DB</span>
            }
          </button>
        </div>

        @if (auditService.syncMessage()) {
          <div class="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono flex items-center justify-between animate-fade-in shadow-sm">
            <span>✓ {{ auditService.syncMessage() }}</span>
            <button (click)="auditService.syncMessage.set(null)" class="text-slate-400 hover:text-white font-bold ml-2">✕</button>
          </div>
        }

        <!-- METRICS ROW (Performance KPIs) -->
        <div class="grid grid-cols-3 gap-2">
          <div class="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm text-center">
            <span class="text-[9px] font-mono uppercase text-slate-400 block font-bold">Win Rate</span>
            <span class="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 block">
              {{ auditService.metricsSummary.winRatePct }}%
            </span>
          </div>

          <div class="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm text-center">
            <span class="text-[9px] font-mono uppercase text-slate-400 block font-bold">Unidades</span>
            <span class="text-base font-black font-mono text-cyan-600 dark:text-cyan-400 block">
              +{{ auditService.metricsSummary.profitUnits }}u
            </span>
          </div>

          <div class="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-sm text-center">
            <span class="text-[9px] font-mono uppercase text-slate-400 block font-bold">ROI Auditado</span>
            <span class="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 block">
              +{{ auditService.metricsSummary.roiPct }}%
            </span>
          </div>
        </div>

        <!-- TIER SEGMENTED TABS (Oficiales vs Probables vs Todos) -->
        <div class="flex items-center p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/40 dark:border-white/5 text-xs font-bold">
          <button
            (click)="auditService.setTier('oficial')"
            [class.bg-white]="auditService.selectedTier() === 'oficial'"
            [class.dark:bg-slate-900]="auditService.selectedTier() === 'oficial'"
            [class.text-slate-950]="auditService.selectedTier() === 'oficial'"
            [class.dark:text-white]="auditService.selectedTier() === 'oficial'"
            [class.shadow-sm]="auditService.selectedTier() === 'oficial'"
            [class.text-slate-600]="auditService.selectedTier() !== 'oficial'"
            [class.dark:text-slate-400]="auditService.selectedTier() !== 'oficial'"
            class="flex-1 py-1.5 rounded-xl transition-all text-center flex items-center justify-center space-x-1"
          >
            <span>🎯</span>
            <span>Oficiales (+EV)</span>
          </button>

          <button
            (click)="auditService.setTier('probable')"
            [class.bg-white]="auditService.selectedTier() === 'probable'"
            [class.dark:bg-slate-900]="auditService.selectedTier() === 'probable'"
            [class.text-slate-950]="auditService.selectedTier() === 'probable'"
            [class.dark:text-white]="auditService.selectedTier() === 'probable'"
            [class.shadow-sm]="auditService.selectedTier() === 'probable'"
            [class.text-slate-600]="auditService.selectedTier() !== 'probable'"
            [class.dark:text-slate-400]="auditService.selectedTier() !== 'probable'"
            class="flex-1 py-1.5 rounded-xl transition-all text-center flex items-center justify-center space-x-1"
          >
            <span>📊</span>
            <span>Probables</span>
          </button>

          <button
            (click)="auditService.setTier('all')"
            [class.bg-white]="auditService.selectedTier() === 'all'"
            [class.dark:bg-slate-900]="auditService.selectedTier() === 'all'"
            [class.text-slate-950]="auditService.selectedTier() === 'all'"
            [class.dark:text-white]="auditService.selectedTier() === 'all'"
            [class.shadow-sm]="auditService.selectedTier() === 'all'"
            [class.text-slate-600]="auditService.selectedTier() !== 'all'"
            [class.dark:text-slate-400]="auditService.selectedTier() !== 'all'"
            class="flex-1 py-1.5 rounded-xl transition-all text-center"
          >
            Todos
          </button>
        </div>

        <!-- SPORT PILLS -->
        <div class="flex items-center space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          <button
            (click)="auditService.setSport('all')"
            [class.bg-slate-900]="auditService.selectedSport() === 'all' && !theme.isDark()"
            [class.bg-white]="auditService.selectedSport() === 'all' && theme.isDark()"
            [class.text-white]="auditService.selectedSport() === 'all' && !theme.isDark()"
            [class.text-slate-900]="auditService.selectedSport() === 'all' && theme.isDark()"
            [class.font-black]="auditService.selectedSport() === 'all'"
            [class.bg-slate-100]="auditService.selectedSport() !== 'all'"
            [class.dark:bg-slate-800/70]="auditService.selectedSport() !== 'all'"
            [class.text-slate-600]="auditService.selectedSport() !== 'all'"
            [class.dark:text-slate-300]="auditService.selectedSport() !== 'all'"
            class="px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm"
          >
            🌐 Todas
          </button>

          <button
            (click)="auditService.setSport('futbol')"
            [class.bg-slate-900]="auditService.selectedSport() === 'futbol' && !theme.isDark()"
            [class.bg-white]="auditService.selectedSport() === 'futbol' && theme.isDark()"
            [class.text-white]="auditService.selectedSport() === 'futbol' && !theme.isDark()"
            [class.text-slate-900]="auditService.selectedSport() === 'futbol' && theme.isDark()"
            [class.font-black]="auditService.selectedSport() === 'futbol'"
            [class.bg-slate-100]="auditService.selectedSport() !== 'futbol'"
            [class.dark:bg-slate-800/70]="auditService.selectedSport() !== 'futbol'"
            [class.text-slate-600]="auditService.selectedSport() !== 'futbol'"
            [class.dark:text-slate-300]="auditService.selectedSport() !== 'futbol'"
            class="px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm"
          >
            ⚽ Fútbol
          </button>

          <button
            (click)="auditService.setSport('nba')"
            [class.bg-slate-900]="auditService.selectedSport() === 'nba' && !theme.isDark()"
            [class.bg-white]="auditService.selectedSport() === 'nba' && theme.isDark()"
            [class.text-white]="auditService.selectedSport() === 'nba' && !theme.isDark()"
            [class.text-slate-900]="auditService.selectedSport() === 'nba' && theme.isDark()"
            [class.font-black]="auditService.selectedSport() === 'nba'"
            [class.bg-slate-100]="auditService.selectedSport() !== 'nba'"
            [class.dark:bg-slate-800/70]="auditService.selectedSport() !== 'nba'"
            [class.text-slate-600]="auditService.selectedSport() !== 'nba'"
            [class.dark:text-slate-300]="auditService.selectedSport() !== 'nba'"
            class="px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm"
          >
            🏀 NBA
          </button>

          <button
            (click)="auditService.setSport('nfl')"
            [class.bg-slate-900]="auditService.selectedSport() === 'nfl' && !theme.isDark()"
            [class.bg-white]="auditService.selectedSport() === 'nfl' && theme.isDark()"
            [class.text-white]="auditService.selectedSport() === 'nfl' && !theme.isDark()"
            [class.text-slate-900]="auditService.selectedSport() === 'nfl' && theme.isDark()"
            [class.font-black]="auditService.selectedSport() === 'nfl'"
            [class.bg-slate-100]="auditService.selectedSport() !== 'nfl'"
            [class.dark:bg-slate-800/70]="auditService.selectedSport() !== 'nfl'"
            [class.text-slate-600]="auditService.selectedSport() !== 'nfl'"
            [class.dark:text-slate-300]="auditService.selectedSport() !== 'nfl'"
            class="px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm"
          >
            🏈 NFL
          </button>
        </div>
      </header>

      <!-- AUDITED PICKS FEED -->
      <main class="px-4 space-y-3.5 pt-3.5">
        @for (record of auditService.filteredRecords(); track record.id) {
          <div class="p-4 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
            
            <!-- Top Status Row -->
            <div class="flex items-center justify-between text-xs">
              <span class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300 font-bold text-[11px]">
                {{ record.league }} &bull; {{ record.date }}
              </span>

              @if (record.status === 'WON') {
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-black text-[11px] border border-emerald-500/30 flex items-center space-x-1">
                  <span>✓</span>
                  <span>ACERTADO (+{{ record.profitUnits }}u)</span>
                </span>
              } @else if (record.status === 'LOST') {
                <span class="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-black text-[11px] border border-rose-500/30 flex items-center space-x-1">
                  <span>✕</span>
                  <span>FALLADO (-1.00u)</span>
                </span>
              } @else {
                <span class="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-black text-[11px] border border-cyan-500/30">
                  PENDIENTE
                </span>
              }
            </div>

            <!-- Match Teams & Logos -->
            <div class="flex items-center justify-between py-1">
              <div class="flex items-center space-x-2.5">
                <img [src]="record.homeLogo" class="w-7 h-7 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 p-0.5" />
                <span class="font-black text-xs sm:text-sm text-slate-900 dark:text-white">{{ record.homeTeam }}</span>
              </div>
              <span class="text-xs font-mono font-bold text-slate-400">vs</span>
              <div class="flex items-center space-x-2.5 text-right">
                <span class="font-black text-xs sm:text-sm text-slate-900 dark:text-white">{{ record.awayTeam }}</span>
                <img [src]="record.awayLogo" class="w-7 h-7 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 p-0.5" />
              </div>
            </div>

            <!-- Selection and Odds Card -->
            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
              <div>
                <span class="text-[10px] uppercase font-mono text-slate-400 block font-bold">Pick Pronosticado</span>
                <span class="font-black text-slate-900 dark:text-white">{{ record.selection }}</span>
              </div>
              <div class="text-right">
                <span class="text-[10px] uppercase font-mono text-slate-400 block font-bold">Cuota</span>
                <span class="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">@ {{ record.odds.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Score and Result Details -->
            <div class="flex items-center justify-between text-xs font-mono pt-0.5 text-slate-500 dark:text-slate-400">
              <div class="flex items-center space-x-1.5">
                <span class="font-bold">Marcador Oficial:</span>
                <span class="font-black text-slate-800 dark:text-slate-200">{{ record.resultScore }}</span>
              </div>
              <div class="text-emerald-600 dark:text-emerald-400 font-bold">
                +{{ record.clvEdgePct }}% CLV
              </div>
            </div>

            <!-- Cryptographic SHA-256 Stamp -->
            <div class="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span class="flex items-center space-x-1 truncate max-w-[220px]">
                <span>🔒</span>
                <span class="truncate">sha256:{{ record.sha256Hash }}</span>
              </span>
              <span class="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                Sellado Pre-Kickoff ✓
              </span>
            </div>

          </div>
        }
      </main>

    </div>
  `
})
export class AuditComponent {
  public auditService = inject(AuditService);
  public theme = inject(ThemeService);
}
