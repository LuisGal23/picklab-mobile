import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchAnalysisService } from './services/match-analysis.service';

@Component({
  selector: 'app-match-analysis-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (modalService.isOpen() && modalService.getAnalysis()(); as data) {
      <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fade-in">
        <div class="w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-slide-up border border-slate-100">
          
          <!-- Modal Handle (Mobile) -->
          <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto sm:hidden -mt-1 mb-2"></div>

          <!-- Modal Header -->
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <div class="flex items-center space-x-2">
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
                  {{ data.league }}
                </span>
                <span class="text-xs text-slate-500 font-medium">{{ data.kickoff }}</span>
              </div>
              <h2 class="text-xl font-black text-slate-900 tracking-tight">{{ data.matchTitle }}</h2>
            </div>
            <button
              (click)="modalService.closeAnalysis()"
              class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-lg transition-colors"
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
            <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span class="text-[10px] text-slate-500 font-mono uppercase block">Media Proyectada (μ)</span>
              <span class="text-base font-black text-slate-900 font-mono">{{ data.muML }}</span>
            </div>
            <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span class="text-[10px] text-slate-500 font-mono uppercase block">Varianza ML (σ)</span>
              <span class="text-base font-black text-slate-900 font-mono">{{ data.sigmaML }}</span>
            </div>
            <div class="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span class="text-[10px] text-slate-500 font-mono uppercase block">Prob. Over</span>
              <span class="text-base font-black text-emerald-600 font-mono">{{ data.overProbPct }}%</span>
            </div>
          </div>

          <!-- Percentiles Distribution -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span class="text-[11px] font-mono font-bold uppercase text-slate-600 block">Distribución de Percentiles (Monte Carlo):</span>
            <div class="grid grid-cols-5 gap-1.5 text-center font-mono text-xs">
              <div class="p-2 rounded-xl bg-white border border-slate-200">
                <span class="text-[9px] text-slate-500 block">P10</span>
                <span class="font-bold text-slate-800">{{ data.percentiles.p10 }}</span>
              </div>
              <div class="p-2 rounded-xl bg-white border border-slate-200">
                <span class="text-[9px] text-slate-500 block">P25</span>
                <span class="font-bold text-slate-800">{{ data.percentiles.p25 }}</span>
              </div>
              <div class="p-2 rounded-xl bg-emerald-50 border border-emerald-300">
                <span class="text-[9px] text-emerald-700 font-bold block">P50 (Mediana)</span>
                <span class="font-black text-emerald-800">{{ data.percentiles.p50 }}</span>
              </div>
              <div class="p-2 rounded-xl bg-white border border-slate-200">
                <span class="text-[9px] text-slate-500 block">P75</span>
                <span class="font-bold text-slate-800">{{ data.percentiles.p75 }}</span>
              </div>
              <div class="p-2 rounded-xl bg-white border border-slate-200">
                <span class="text-[9px] text-slate-500 block">P90</span>
                <span class="font-bold text-slate-800">{{ data.percentiles.p90 }}</span>
              </div>
            </div>
          </div>

          <!-- Model Rationale -->
          <div class="space-y-2">
            <span class="text-[11px] font-mono font-bold uppercase text-slate-600 block">Fundamento Cuantitativo:</span>
            <ul class="space-y-1.5 text-xs text-slate-600 font-medium">
              @for (point of data.reasoning; track point) {
                <li class="flex items-start space-x-2">
                  <span class="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span>{{ point }}</span>
                </li>
              }
            </ul>
          </div>

          <!-- Bottom Action -->
          <button
            (click)="modalService.closeAnalysis()"
            class="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md active:scale-[0.98]"
          >
            Entendido, Cerrar Análisis
          </button>

        </div>
      </div>
    }
  `
})
export class MatchAnalysisModalComponent {
  public modalService = inject(MatchAnalysisService);
}
