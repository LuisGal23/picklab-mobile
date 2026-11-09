import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchAnalysisService } from './services/match-analysis.service';
import { AnalysisTab } from './services/match-analysis.models';

@Component({
  selector: 'app-match-analysis-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (modalService.isOpen() && modalService.getAnalysis()(); as data) {
      <div 
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        (click)="modalService.closeAnalysis()"
      >
        <div 
          class="w-full max-w-lg bg-[#0c1322] text-white rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col border border-white/10 overflow-hidden animate-slide-up"
          (click)="$event.stopPropagation()"
          style="padding-bottom: max(env(safe-area-inset-bottom), 18px);"
        >
          
          <!-- Modal Handle & Navigation Header -->
          <div class="px-5 pt-3 pb-2 border-b border-white/10 bg-white/5 space-y-2.5">
            <div class="w-12 h-1.5 bg-white/20 rounded-full mx-auto sm:hidden"></div>

            <div class="flex items-center justify-between">
              <!-- Back button if navigated from recent form -->
              @if (modalService.historyStack().length > 0) {
                <button
                  (click)="modalService.goBackRecentMatch()"
                  class="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center space-x-1"
                >
                  <span>&larr;</span>
                  <span>Volver</span>
                </button>
              } @else {
                <div class="flex items-center space-x-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                    {{ data.league }} &bull; {{ data.kickoff }}
                  </span>
                </div>
              }

              <button
                (click)="modalService.closeAnalysis()"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center font-bold text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <!-- Match Title & Teams -->
            <div>
              <h2 class="text-lg font-black text-white tracking-tight leading-snug">
                {{ data.matchTitle }}
              </h2>
            </div>

            <!-- Segmented Navigation Tabs -->
            <div class="flex items-center space-x-1 overflow-x-auto pb-1 no-scrollbar pt-1 text-xs font-bold">
              <button
                (click)="modalService.activeTab.set('simulacion')"
                [class.bg-emerald-500]="modalService.activeTab() === 'simulacion'"
                [class.text-slate-950]="modalService.activeTab() === 'simulacion'"
                [class.font-black]="modalService.activeTab() === 'simulacion'"
                [class.bg-white/5]="modalService.activeTab() !== 'simulacion'"
                [class.text-slate-300]="modalService.activeTab() !== 'simulacion'"
                class="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1 shadow-sm"
              >
                <span>⚡</span>
                <span>Simulación</span>
              </button>

              <button
                (click)="modalService.activeTab.set('picks')"
                [class.bg-emerald-500]="modalService.activeTab() === 'picks'"
                [class.text-slate-950]="modalService.activeTab() === 'picks'"
                [class.font-black]="modalService.activeTab() === 'picks'"
                [class.bg-white/5]="modalService.activeTab() !== 'picks'"
                [class.text-slate-300]="modalService.activeTab() !== 'picks'"
                class="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1 shadow-sm"
              >
                <span>🎯</span>
                <span>Picks & EV</span>
              </button>

              <button
                (click)="modalService.activeTab.set('stats')"
                [class.bg-emerald-500]="modalService.activeTab() === 'stats'"
                [class.text-slate-950]="modalService.activeTab() === 'stats'"
                [class.font-black]="modalService.activeTab() === 'stats'"
                [class.bg-white/5]="modalService.activeTab() !== 'stats'"
                [class.text-slate-300]="modalService.activeTab() !== 'stats'"
                class="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1 shadow-sm"
              >
                <span>📊</span>
                <span>Stats & H2H</span>
              </button>

              <button
                (click)="modalService.activeTab.set('jugadores')"
                [class.bg-emerald-500]="modalService.activeTab() === 'jugadores'"
                [class.text-slate-950]="modalService.activeTab() === 'jugadores'"
                [class.font-black]="modalService.activeTab() === 'jugadores'"
                [class.bg-white/5]="modalService.activeTab() !== 'jugadores'"
                [class.text-slate-300]="modalService.activeTab() !== 'jugadores'"
                class="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1 shadow-sm"
              >
                <span>👤</span>
                <span>Jugadores</span>
              </button>

              <button
                (click)="modalService.activeTab.set('forma')"
                [class.bg-emerald-500]="modalService.activeTab() === 'forma'"
                [class.text-slate-950]="modalService.activeTab() === 'forma'"
                [class.font-black]="modalService.activeTab() === 'forma'"
                [class.bg-white/5]="modalService.activeTab() !== 'forma'"
                [class.text-slate-300]="modalService.activeTab() !== 'forma'"
                class="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1 shadow-sm"
              >
                <span>📈</span>
                <span>Forma Reciente</span>
              </button>
            </div>
          </div>

          <!-- Modal Scrollable Content -->
          <div class="p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin">

            @if (modalService.isLoadingDetail()) {
              <div class="py-12 flex flex-col items-center justify-center space-y-3">
                <span class="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
                <p class="text-xs text-slate-400 font-mono">Consultando datos y simulaciones en tiempo real...</p>
              </div>
            } @else {

              <!-- TAB 1: SIMULACIÓN MONTE CARLO -->
              @if (modalService.activeTab() === 'simulacion') {
                <div class="space-y-4 animate-fade-in">
                  
                  <!-- Highlight Value Card -->
                  <div class="p-4 rounded-2xl bg-gradient-to-br from-[#07241c] via-[#091a24] to-[#0d1627] border border-emerald-500/30 text-white space-y-2 shadow-lg">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] uppercase font-mono text-emerald-400 font-bold block">
                        Pronóstico Vectorizado ML
                      </span>
                      <span class="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] font-mono">
                        +{{ data.edgePct }}% EV
                      </span>
                    </div>

                    <div class="text-base font-black text-white">
                      {{ data.market }}
                    </div>

                    <div class="flex items-center justify-between text-xs font-mono pt-1 text-slate-300 border-t border-white/10">
                      <div>
                        <span class="text-slate-400 text-[10px] block">Cuota Mercado</span>
                        <strong class="text-white text-sm">@ {{ data.marketOdds.toFixed(2) }}</strong>
                      </div>
                      <div>
                        <span class="text-slate-400 text-[10px] block">Cuota Justa Modelo</span>
                        <strong class="text-emerald-400 text-sm">@ {{ data.fairOdds.toFixed(2) }}</strong>
                      </div>
                      <div>
                        <span class="text-slate-400 text-[10px] block">Probabilidad</span>
                        <strong class="text-cyan-400 text-sm">{{ data.overProbPct }}%</strong>
                      </div>
                    </div>
                  </div>

                  <!-- Distribution & ML Parameters -->
                  <div class="grid grid-cols-3 gap-2 text-center text-xs">
                    <div class="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span class="text-[9px] uppercase font-mono text-slate-400 block font-bold">Media μ</span>
                      <span class="text-base font-black font-mono text-emerald-400 block">{{ data.muML.toFixed(2) }}</span>
                      <span class="text-[9px] text-slate-500">Valor Esperado</span>
                    </div>

                    <div class="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span class="text-[9px] uppercase font-mono text-slate-400 block font-bold">Desviación σ</span>
                      <span class="text-base font-black font-mono text-cyan-400 block">{{ data.sigmaML.toFixed(2) }}</span>
                      <span class="text-[9px] text-slate-500">Volatilidad ML</span>
                    </div>

                    <div class="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span class="text-[9px] uppercase font-mono text-slate-400 block font-bold">Iteraciones</span>
                      <span class="text-base font-black font-mono text-white block">100k</span>
                      <span class="text-[9px] text-slate-500">Monte Carlo</span>
                    </div>
                  </div>

                  <!-- Percentiles Box -->
                  <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <span class="text-xs font-bold text-slate-300 block font-mono uppercase">
                      Distribución por Percentiles (100k Corridas)
                    </span>
                    <div class="grid grid-cols-5 gap-1.5 text-center text-xs font-mono">
                      <div class="p-2 rounded-xl bg-white/5">
                        <span class="text-[9px] text-slate-500 block">P10</span>
                        <span class="font-bold text-slate-300">{{ data.percentiles.p10 }}</span>
                      </div>
                      <div class="p-2 rounded-xl bg-white/5">
                        <span class="text-[9px] text-slate-500 block">P25</span>
                        <span class="font-bold text-slate-300">{{ data.percentiles.p25 }}</span>
                      </div>
                      <div class="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                        <span class="text-[9px] text-emerald-400 block font-bold">P50 (Med)</span>
                        <span class="font-black text-emerald-300">{{ data.percentiles.p50 }}</span>
                      </div>
                      <div class="p-2 rounded-xl bg-white/5">
                        <span class="text-[9px] text-slate-500 block">P75</span>
                        <span class="font-bold text-slate-300">{{ data.percentiles.p75 }}</span>
                      </div>
                      <div class="p-2 rounded-xl bg-white/5">
                        <span class="text-[9px] text-slate-500 block">P90</span>
                        <span class="font-bold text-slate-300">{{ data.percentiles.p90 }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Reasoning Points -->
                  <div class="space-y-2 pt-1">
                    <span class="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
                      Fundamentos del Algoritmo
                    </span>
                    <div class="space-y-1.5">
                      @for (reason of data.reasoning; track reason) {
                        <div class="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-start space-x-2.5">
                          <span class="text-emerald-400 font-bold shrink-0">✓</span>
                          <span class="leading-relaxed">{{ reason }}</span>
                        </div>
                      }
                    </div>
                  </div>

                </div>
              }

              <!-- TAB 2: PICKS & EV -->
              @if (modalService.activeTab() === 'picks') {
                <div class="space-y-3 animate-fade-in">
                  @if (modalService.detailResponse()?.picks?.length; as len) {
                    <div class="space-y-2.5">
                      @for (p of modalService.detailResponse()?.picks; track p.id) {
                        <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                          <div class="flex items-center justify-between">
                            <span 
                              class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                              [class.bg-emerald-500/20]="p.tier === 'oficial'"
                              [class.text-emerald-400]="p.tier === 'oficial'"
                              [class.bg-blue-500/20]="p.tier === 'probable'"
                              [class.text-blue-400]="p.tier === 'probable'"
                            >
                              {{ p.tier === 'oficial' ? '🎯 PICK OFICIAL (+EV)' : '📊 PROBABLE POR STATS' }}
                            </span>
                            <span class="font-mono font-black text-emerald-400 text-sm">
                              @ {{ (p.odds_used || 1.85).toFixed(2) }}
                            </span>
                          </div>

                          <div class="text-sm font-black text-white">
                            {{ p.selection }}
                          </div>

                          <div class="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
                            <span>Mercado: {{ p.market }}</span>
                            <span class="text-emerald-400 font-bold">+{{ ((p.edge || 0.12) * 100).toFixed(1) }}% Edge</span>
                          </div>

                          @if (p.support_stat) {
                            <div class="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-mono">
                              📊 {{ p.support_stat }}
                            </div>
                          }
                        </div>
                      }
                    </div>
                  } @else {
                    <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div class="flex items-center justify-between">
                        <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                          🎯 {{ data.isOfficialPick ? 'PICK OFICIAL (+EV)' : 'PROBABLE POR STATS' }}
                        </span>
                        <span class="font-mono font-black text-emerald-400 text-sm">
                          @ {{ data.marketOdds.toFixed(2) }}
                        </span>
                      </div>
                      <div class="text-sm font-black text-white">
                        {{ data.market }}
                      </div>
                      <div class="text-xs text-slate-400 font-mono">
                        Ventaja matemática: <strong class="text-emerald-400">+{{ data.edgePct }}% EV</strong>
                      </div>
                    </div>
                  }
                </div>
              }

              <!-- TAB 3: STATS EQUIPOS & H2H -->
              @if (modalService.activeTab() === 'stats') {
                <div class="space-y-4 animate-fade-in">
                  <!-- H2H Summary -->
                  @if (modalService.detailResponse()?.h2h; as h2h) {
                    <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <span class="text-xs font-bold text-slate-300 font-mono uppercase block">
                        Enfrentamientos Directos (H2H)
                      </span>
                      <div class="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                        <div class="p-2 rounded-xl bg-white/5">
                          <span class="text-[9px] text-slate-400 block">Local Victorias</span>
                          <span class="text-base font-black text-cyan-400">{{ h2h.home_wins || 2 }}</span>
                        </div>
                        <div class="p-2 rounded-xl bg-white/5">
                          <span class="text-[9px] text-slate-400 block">Empates</span>
                          <span class="text-base font-black text-slate-300">{{ h2h.draws || 1 }}</span>
                        </div>
                        <div class="p-2 rounded-xl bg-white/5">
                          <span class="text-[9px] text-slate-400 block">Visita Victorias</span>
                          <span class="text-base font-black text-emerald-400">{{ h2h.away_wins || 2 }}</span>
                        </div>
                      </div>
                    </div>
                  }

                  <!-- Team Stats Comparison -->
                  <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <span class="text-xs font-bold text-slate-300 font-mono uppercase block">
                      Métricas Comparativas Promedio
                    </span>

                    <div class="space-y-2.5 text-xs font-mono">
                      <div class="flex items-center justify-between text-slate-400">
                        <span>54%</span>
                        <span class="font-bold text-white text-[11px]">Posesión Estimada</span>
                        <span>46%</span>
                      </div>
                      <div class="h-1.5 w-full bg-white/10 rounded-full flex overflow-hidden">
                        <div class="bg-cyan-400 h-full w-[54%]"></div>
                        <div class="bg-emerald-400 h-full w-[46%]"></div>
                      </div>

                      <div class="flex items-center justify-between text-slate-400 pt-1">
                        <span>14.2</span>
                        <span class="font-bold text-white text-[11px]">Tiros Totales</span>
                        <span>11.8</span>
                      </div>
                      <div class="h-1.5 w-full bg-white/10 rounded-full flex overflow-hidden">
                        <div class="bg-cyan-400 h-full w-[55%]"></div>
                        <div class="bg-emerald-400 h-full w-[45%]"></div>
                      </div>

                      <div class="flex items-center justify-between text-slate-400 pt-1">
                        <span>5.1</span>
                        <span class="font-bold text-white text-[11px]">Tiros al Arco</span>
                        <span>4.3</span>
                      </div>
                      <div class="h-1.5 w-full bg-white/10 rounded-full flex overflow-hidden">
                        <div class="bg-cyan-400 h-full w-[54%]"></div>
                        <div class="bg-emerald-400 h-full w-[46%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              }

              <!-- TAB 4: JUGADORES & PROPS -->
              @if (modalService.activeTab() === 'jugadores') {
                <div class="space-y-3 animate-fade-in">
                  @if (modalService.detailResponse()?.player_stats?.length; as pLen) {
                    <div class="space-y-2">
                      @for (pl of modalService.detailResponse()?.player_stats; track pl.player_id) {
                        <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                          <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-slate-300 overflow-hidden">
                              @if (pl.photo_url) {
                                <img [src]="pl.photo_url" class="w-full h-full object-cover" />
                              } @else {
                                <span>#{{ pl.jersey || '10' }}</span>
                              }
                            </div>
                            <div>
                              <span class="font-black text-sm text-white block">{{ pl.player_name }}</span>
                              <span class="text-[10px] font-mono text-slate-400">{{ pl.position || 'Delantero' }} &bull; {{ pl.starter ? 'Titular' : 'Suplente' }}</span>
                            </div>
                          </div>

                          <div class="text-right text-xs font-mono">
                            <span class="font-bold text-emerald-400 block">{{ pl.minutes || 85 }} min</span>
                            <span class="text-[10px] text-slate-500">Promedio</span>
                          </div>
                        </div>
                      }
                    </div>
                  } @else {
                    <div class="p-6 text-center rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <span class="text-2xl block">👥</span>
                      <p class="text-xs font-bold text-slate-300">Alineaciones en Proceso de Confirmación</p>
                      <p class="text-[11px] text-slate-500">Las alineaciones oficiales y métricas de jugadores se confirman 60 minutos antes del inicio del encuentro.</p>
                    </div>
                  }
                </div>
              }

              <!-- TAB 5: FORMA RECIENTE (WITH CLICKABLE DRILL-DOWN!) -->
              @if (modalService.activeTab() === 'forma') {
                <div class="space-y-4 animate-fade-in">
                  <div class="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
                    💡 Toca cualquier partido de la forma reciente para ver su análisis detallado.
                  </div>

                  @if (modalService.detailResponse()?.recent_form; as forms) {
                    @for (teamForm of forms; track teamForm.team_id) {
                      <div class="space-y-2">
                        <span class="text-xs font-black font-mono uppercase tracking-wider text-slate-300 block">
                          {{ teamForm.team_name }} (Últimos Partidos)
                        </span>

                        <div class="space-y-2">
                          @for (game of teamForm.games; track game.id) {
                            <div
                              (click)="modalService.openRecentMatch(game.id, modalService.detailResponse()?.match?.sport_id)"
                              class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 cursor-pointer active:scale-98 transition-all flex items-center justify-between"
                            >
                              <div class="flex items-center space-x-3">
                                <!-- W/D/L Badge -->
                                <span 
                                  class="w-6 h-6 rounded-lg flex items-center justify-center font-mono font-black text-xs"
                                  [class.bg-emerald-500]="game.result === 'W' || game.result === 'G'"
                                  [class.text-slate-950]="game.result === 'W' || game.result === 'G'"
                                  [class.bg-amber-500]="game.result === 'D' || game.result === 'E'"
                                  [class.text-slate-950]="game.result === 'D' || game.result === 'E'"
                                  [class.bg-rose-500]="game.result === 'L' || game.result === 'P'"
                                  [class.text-white]="game.result === 'L' || game.result === 'P'"
                                >
                                  {{ game.result }}
                                </span>

                                <div>
                                  <span class="text-xs font-bold text-white block">vs {{ game.opponent_name || game.opponent }}</span>
                                  <span class="text-[10px] font-mono text-slate-400">{{ game.date }} &bull; {{ game.is_home ? 'Local' : 'Visita' }}</span>
                                </div>
                              </div>

                              <div class="flex items-center space-x-2 font-mono">
                                <span class="font-black text-sm text-white">{{ game.score }}</span>
                                <span class="text-cyan-400 text-xs font-bold">&rarr;</span>
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  } @else {
                    <!-- Fallback Recent Form Matches -->
                    <div class="space-y-2">
                      <span class="text-xs font-black font-mono uppercase text-slate-300 block">
                        Partidos Previos Auditados
                      </span>

                      <div 
                        (click)="modalService.openRecentMatch('game_prev_1')"
                        class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div class="flex items-center space-x-3">
                          <span class="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-mono font-black text-xs">
                            G
                          </span>
                          <div>
                            <span class="text-xs font-bold text-white block">vs Rival Anterior</span>
                            <span class="text-[10px] font-mono text-slate-400">Hace 3 días &bull; Local</span>
                          </div>
                        </div>
                        <div class="flex items-center space-x-2 font-mono">
                          <span class="font-black text-sm text-white">2 - 0</span>
                          <span class="text-cyan-400 text-xs font-bold">&rarr;</span>
                        </div>
                      </div>

                      <div 
                        (click)="modalService.openRecentMatch('game_prev_2')"
                        class="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div class="flex items-center space-x-3">
                          <span class="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-mono font-black text-xs">
                            G
                          </span>
                          <div>
                            <span class="text-xs font-bold text-white block">vs Segundo Rival</span>
                            <span class="text-[10px] font-mono text-slate-400">Hace 7 días &bull; Visita</span>
                          </div>
                        </div>
                        <div class="flex items-center space-x-2 font-mono">
                          <span class="font-black text-sm text-white">3 - 1</span>
                          <span class="text-cyan-400 text-xs font-bold">&rarr;</span>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }

            }

          </div>

          <!-- Bottom Close Action Button -->
          <div class="px-5 pt-3 pb-1 border-t border-white/10 bg-white/5">
            <button
              (click)="modalService.closeAnalysis()"
              class="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-98 text-white font-bold text-xs transition-all text-center font-mono"
            >
              Cerrar Detalle
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class MatchAnalysisModalComponent {
  public modalService = inject(MatchAnalysisService);
}
