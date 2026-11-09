import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchAnalysisService } from './services/match-analysis.service';

@Component({
  selector: 'app-match-analysis-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (modalService.isOpen() && modalService.getAnalysis()(); as data) {
      <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fade-in" (click)="modalService.closeAnalysis()">
        <div 
          class="w-full max-w-lg bg-white dark:bg-[#0c1322] text-slate-900 dark:text-white rounded-t-[2.5rem] sm:rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-slide-up border border-slate-100 dark:border-white/10"
          (click)="$event.stopPropagation()"
          style="padding-bottom: max(env(safe-area-inset-bottom), 24px);"
        >
          
          <!-- Modal Handle (Mobile) -->
          <div class="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto sm:hidden -mt-1 mb-2"></div>

          <!-- Modal Header -->
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <div class="flex items-center space-x-2">
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-bold">
                  {{ data.league }}
                </span>
                <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">{{ data.kickoff }}</span>
              </div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">{{ data.matchTitle }}</h2>
            </div>
            <button
              (click)="modalService.closeAnalysis()"
              class="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-lg transition-colors"
            >
              ✕
            </button>
          </div>

          <!-- Highlight Value Badge -->
          <div class="p-4 rounded-2xl bg-gradient-to-br from-[#0c3127] to-[#041d17] text-white flex items-center justify-between shadow-lg">
            <div>
              <span class="text-[10px] uppercase font-mono text-emerald-300 font-bold block">Pronóstico Vectorizado ML</span>
              <span class="text-lg font-black">{{ data.market }}</span>
              <div class="text-xs text-slate-300 font-mono mt-0.5">
                Cuota Bookie: <strong class="text-white">@ {{ data.marketOdds.toFixed(2) }}</strong>
                &bull; Cuota Justa: <strong class="text-emerald-400">@ {{ data.fairOdds.toFixed(2) }}</strong>
              </div>
            </div>
            <div class="text-right">
              <span class="px-3 py-1 rounded-full bg-[#22c55e] text-slate-950 font-black text-xs font-mono inline-block">
                +{{ data.edgePct }}% EV
              </span>
              <span class="text-[10px] text-emerald-200 font-mono block mt-1">100k Simulaciones</span>
            </div>
          </div>

          <!-- ML Parameters Card -->
          <div class="grid grid-cols-3 gap-2.5 text-center">
            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
              <span class="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase block">Media Proyectada (μ)</span>
              <span class="text-base font-black text-slate-900 dark:text-white font-mono">{{ data.muML }}</span>
            </div>
            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
              <span class="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase block">Volatilidad (σ)</span>
              <span class="text-base font-black text-slate-900 dark:text-white font-mono">{{ data.sigmaML }}</span>
            </div>
            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
              <span class="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase block">Distribución</span>
              <span class="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">{{ data.distributionType }}</span>
            </div>
          </div>

          <!-- Monte Carlo Probability Split Bar -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Over {{ data.targetLine }}: <strong class="text-emerald-600 dark:text-emerald-400">{{ data.overProbPct }}%</strong></span>
              <span>Under {{ data.targetLine }}: <strong class="text-slate-500 dark:text-slate-400">{{ data.underProbPct }}%</strong></span>
            </div>
            <div class="w-full h-3 rounded-full bg-slate-100 dark:bg-white/10 flex overflow-hidden">
              <div [style.width.%]="data.overProbPct" class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full"></div>
              <div [style.width.%]="data.underProbPct" class="bg-slate-300 dark:bg-slate-700 h-full"></div>
            </div>
          </div>

          <!-- Quantitative Reasoning List -->
          <div class="space-y-2">
            <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Factores Clave del Modelo</h4>
            <div class="space-y-2">
              @for (reason of data.reasoning; track reason) {
                <div class="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <span class="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>{{ reason }}</span>
                </div>
              }
            </div>
          </div>

        </div>
      </div>
    }
  `
})
export class MatchAnalysisModalComponent {
  public modalService = inject(MatchAnalysisService);
}
