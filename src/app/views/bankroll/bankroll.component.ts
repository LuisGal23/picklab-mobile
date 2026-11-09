import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankrollService } from './services/bankroll.service';

@Component({
  selector: 'app-mobile-bankroll',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#F5F6F8] text-slate-900 pb-24 font-sans select-none">
      
      <!-- Top Bar -->
      <header class="sticky top-0 z-30 bg-[#F5F6F8]/90 backdrop-blur-md px-5 pt-4 pb-3 flex items-center justify-between">
        <div>
          <span class="text-xs font-mono font-bold uppercase text-emerald-600 block">Gestión de Riesgo</span>
          <h1 class="text-2xl font-black text-slate-950">Tu Bankroll</h1>
        </div>
      </header>

      <main class="px-5 space-y-4 pt-2">
        <!-- Hero Capital Card -->
        <div class="p-6 rounded-3xl bg-slate-950 text-white space-y-4 shadow-xl">
          <span class="text-xs font-mono uppercase text-slate-400 block font-semibold">Capital Total Actual</span>
          <div class="text-4xl font-black font-mono tracking-tight text-white">
            &#36;{{ summary().currentCapital.toFixed(2) }}
          </div>
          <div class="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
            <span>+&#36;{{ summary().totalProfit.toFixed(2) }} ganancia</span>
            <span class="text-slate-500">&bull;</span>
            <span>+{{ summary().roiPct }}% ROI</span>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-2 gap-3">
          <div class="p-4 rounded-3xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-1">
            <span class="text-xs text-slate-500 font-medium">Unidad Sugerida (1u)</span>
            <span class="text-xl font-black text-slate-950 font-mono block">&#36;{{ summary().recommendedUnit.toFixed(2) }}</span>
            <span class="text-[10px] text-slate-400 font-mono">1% del bankroll</span>
          </div>

          <div class="p-4 rounded-3xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-1">
            <span class="text-xs text-slate-500 font-medium">Win Rate Histórico</span>
            <span class="text-xl font-black text-emerald-600 font-mono block">{{ summary().winRatePct }}%</span>
            <span class="text-[10px] text-slate-400 font-mono">{{ summary().totalBets }} apuestas</span>
          </div>
        </div>

        <!-- Staking Criterion Info -->
        <div class="p-4 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs text-emerald-950">
          <div class="flex items-center space-x-2 font-bold text-emerald-900">
            <span>🛡️</span>
            <span>Criterio Kelly Fraccional (1/4 Kelly)</span>
          </div>
          <p class="text-emerald-800 leading-relaxed">
            Las cuotas y probabilidades calculadas por el modelo Monte Carlo sugieren un tamaño de apuesta seguro de 1 a 2 unidades para maximizar crecimiento matemático y minimizar drawdown.
          </p>
        </div>
      </main>

    </div>
  `
})
export class BankrollComponent {
  private service = inject(BankrollService);
  public summary = this.service.getSummary();
}
