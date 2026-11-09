import { Component, inject, signal, computed, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatchAnalysisService } from './services/match-analysis.service';
import { AnalysisTab } from './services/match-analysis.models';
import {
  PlayerMatchStatsItem,
  TeamMatchStatsItem,
  RecentFormGame,
  H2HMatch,
  PickItem,
  ApiService,
  PlayerGamelogResponse,
  PlayerMarketItem
} from '../../../../core/services/api.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-match-analysis-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (modalService.isOpen() && modalService.getAnalysis()(); as data) {
      <div 
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity animate-fade-in"
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
                  class="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center space-x-1 active:scale-95 transition-all"
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
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 flex items-center justify-center font-bold text-sm transition-colors"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <!-- Teams Crests & Score Row -->
            <div class="flex items-center justify-between py-2 px-3 bg-slate-950/60 rounded-2xl border border-white/5 shadow-inner">
              <!-- Home Team -->
              <div class="flex items-center space-x-2.5 w-[40%]">
                <img
                  [src]="getHomeLogo()"
                  (error)="onImgError($event)"
                  class="w-9 h-9 object-contain rounded-xl bg-white/5 p-1 shrink-0"
                  alt=""
                />
                <div class="min-w-0">
                  <span class="font-black text-xs text-white block truncate leading-tight">{{ getHomeName() }}</span>
                  <span class="text-[9px] font-mono text-slate-400 uppercase">Local</span>
                </div>
              </div>

              <!-- Score / VS Center -->
              <div class="text-center px-2">
                @if (isFinished()) {
                  <span class="text-base font-black font-mono text-emerald-400 block leading-none">
                    {{ getHomeScore() }} - {{ getAwayScore() }}
                  </span>
                  <span class="text-[8px] font-mono text-slate-400 uppercase">Final</span>
                } @else if (isLive()) {
                  <span class="text-sm font-black font-mono text-rose-400 block leading-none animate-pulse">
                    {{ getHomeScore() }} - {{ getAwayScore() }}
                  </span>
                  <span class="text-[8px] font-mono text-rose-400 uppercase">En Vivo</span>
                } @else {
                  <span class="px-2.5 py-1 rounded-xl bg-white/10 text-[10px] font-black font-mono text-slate-300">
                    VS
                  </span>
                }
              </div>

              <!-- Away Team -->
              <div class="flex items-center justify-end space-x-2.5 w-[40%] text-right">
                <div class="min-w-0">
                  <span class="font-black text-xs text-white block truncate leading-tight">{{ getAwayName() }}</span>
                  <span class="text-[9px] font-mono text-slate-400 uppercase">Visita</span>
                </div>
                <img
                  [src]="getAwayLogo()"
                  (error)="onImgError($event)"
                  class="w-9 h-9 object-contain rounded-xl bg-white/5 p-1 shrink-0"
                  alt=""
                />
              </div>
            </div>

            <!-- Segmented Navigation Tabs -->
            <div class="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 text-xs font-bold">
              <button
                (click)="modalService.activeTab.set('simulacion')"
                [class.bg-emerald-500]="modalService.activeTab() === 'simulacion'"
                [class.text-slate-950]="modalService.activeTab() === 'simulacion'"
                [class.font-black]="modalService.activeTab() === 'simulacion'"
                [class.bg-white/5]="modalService.activeTab() !== 'simulacion'"
                [class.text-slate-300]="modalService.activeTab() !== 'simulacion'"
                class="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1 shadow-sm active:scale-95"
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
                class="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1 shadow-sm active:scale-95"
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
                class="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1 shadow-sm active:scale-95"
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
                class="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1 shadow-sm active:scale-95"
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
                class="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center space-x-1 shadow-sm active:scale-95"
              >
                <span>📈</span>
                <span>Forma Reciente</span>
              </button>
            </div>
          </div>

          <!-- Modal Scrollable Content -->
          <div class="p-4 sm:p-5 overflow-y-auto space-y-5 text-sm flex-1">
            
            @if (modalService.isLoadingDetail()) {
              <div class="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
                <span class="w-7 h-7 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                <span class="text-xs font-mono font-bold">Cargando datos y simulación Monte Carlo...</span>
              </div>
            } @else {

              <!-- TAB 1: SIMULACIÓN MONTE CARLO -->
              @if (modalService.activeTab() === 'simulacion') {
                <div class="space-y-4 animate-fade-in">
                  <!-- Probability Bar -->
                  <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div class="flex items-center justify-between text-xs font-mono">
                      <span class="font-bold text-cyan-400">{{ getHomeName() }} ({{ getHomeProb() }}%)</span>
                      @if (isSoccer()) {
                        <span class="text-[11px] text-amber-400">Empate ({{ getDrawProb() }}%)</span>
                      }
                      <span class="font-bold text-emerald-400">{{ getAwayName() }} ({{ getAwayProb() }}%)</span>
                    </div>

                    <div class="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex shadow-inner">
                      <div class="bg-cyan-500 h-full transition-all" [style.width.%]="getHomeProb()"></div>
                      @if (isSoccer()) {
                        <div class="bg-amber-400 h-full transition-all" [style.width.%]="getDrawProb()"></div>
                      }
                      <div class="bg-emerald-500 h-full flex-1 transition-all"></div>
                    </div>
                  </div>

                  <!-- 4-KPI Grid -->
                  <div class="grid grid-cols-2 gap-2.5 text-center font-mono">
                    <div class="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span class="text-[9px] uppercase text-slate-400 block font-bold">Favorito Modelo</span>
                      <span class="text-xs font-black text-cyan-300 block truncate mt-0.5">
                        {{ getFavoriteText() }}
                      </span>
                    </div>

                    <div class="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span class="text-[9px] uppercase text-slate-400 block font-bold">Pick de Valor</span>
                      <span class="text-xs font-black text-emerald-400 block truncate mt-0.5">
                        {{ data.market }} (+{{ data.edgePct }}% EV)
                      </span>
                    </div>

                    <div class="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span class="text-[9px] uppercase text-slate-400 block font-bold">Cuota Mercado</span>
                      <span class="text-sm font-black text-amber-400 block mt-0.5">
                        &#64; {{ data.marketOdds }}
                      </span>
                    </div>

                    <div class="p-3 rounded-2xl bg-white/5 border border-white/10">
                      <span class="text-[9px] uppercase text-slate-400 block font-bold">Cuota Justa</span>
                      <span class="text-sm font-black text-emerald-400 block mt-0.5">
                        &#64; {{ data.fairOdds }}
                      </span>
                    </div>
                  </div>

                  <!-- Percentiles Box -->
                  <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                    <div class="flex items-center justify-between text-xs font-mono">
                      <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Percentiles Monte Carlo (100k)</span>
                      <span class="text-emerald-400 font-bold">&mu; = {{ data.muML }} &bull; &sigma; = {{ data.sigmaML }}</span>
                    </div>

                    <div class="grid grid-cols-5 gap-1.5 text-center font-mono text-xs">
                      <div class="p-2 rounded-xl bg-slate-900 border border-white/5">
                        <span class="text-[8px] text-slate-500 block">P10</span>
                        <span class="font-bold text-slate-300">{{ data.percentiles.p10 }}</span>
                      </div>
                      <div class="p-2 rounded-xl bg-slate-900 border border-white/5">
                        <span class="text-[8px] text-slate-500 block">P25</span>
                        <span class="font-bold text-slate-300">{{ data.percentiles.p25 }}</span>
                      </div>
                      <div class="p-2 rounded-xl bg-slate-900 border border-emerald-500/30 bg-emerald-950/20">
                        <span class="text-[8px] text-emerald-400 block font-bold">P50 (Med)</span>
                        <span class="font-black text-emerald-300">{{ data.percentiles.p50 }}</span>
                      </div>
                      <div class="p-2 rounded-xl bg-slate-900 border border-white/5">
                        <span class="text-[8px] text-slate-500 block">P75</span>
                        <span class="font-bold text-slate-300">{{ data.percentiles.p75 }}</span>
                      </div>
                      <div class="p-2 rounded-xl bg-slate-900 border border-white/5">
                        <span class="text-[8px] text-slate-500 block">P90</span>
                        <span class="font-bold text-slate-300">{{ data.percentiles.p90 }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Reasoning Points -->
                  <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <span class="text-[10px] font-mono uppercase text-slate-400 font-bold block">Razonamiento Algorítmico</span>
                    <ul class="space-y-1.5 text-xs text-slate-300">
                      @for (r of data.reasoning; track r) {
                        <li class="flex items-start space-x-2">
                          <span class="text-emerald-400 mt-0.5">&bull;</span>
                          <span>{{ r }}</span>
                        </li>
                      }
                    </ul>
                  </div>
                </div>
              }

              <!-- TAB 2: PICKS & EV -->
              @if (modalService.activeTab() === 'picks') {
                <div class="space-y-3 animate-fade-in">
                  @if (modalService.detailResponse()?.picks?.length; as pickCount) {
                    @for (p of modalService.detailResponse()?.picks; track p.id) {
                      <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 font-mono">
                        <div class="flex items-center justify-between">
                          <span 
                            class="px-2 py-0.5 rounded-md text-[10px] font-black"
                            [class.bg-emerald-500/20]="p.tier === 'oficial'"
                            [class.text-emerald-400]="p.tier === 'oficial'"
                            [class.bg-blue-500/20]="p.tier === 'probable'"
                            [class.text-blue-400]="p.tier === 'probable'"
                          >
                            {{ p.tier === 'oficial' ? '🎯 PICK OFICIAL (+EV)' : '📊 PROBABLE POR STATS' }}
                          </span>
                          <span class="text-amber-400 font-black text-xs">&#64; {{ p.odds_used || 1.85 }}</span>
                        </div>

                        <div class="flex items-center justify-between font-sans">
                          <span class="font-bold text-sm text-white">{{ p.market }}: {{ p.selection }}</span>
                          <span class="text-xs font-mono font-bold text-emerald-400">+{{ Math.round((p.edge || 0.12) * 1000) / 10 }}% EV</span>
                        </div>

                        @if (p.support_stat) {
                          <p class="text-[11px] font-sans text-slate-400 italic bg-slate-950/40 p-2 rounded-xl">
                            📊 {{ p.support_stat }}
                          </p>
                        }
                      </div>
                    }
                  } @else {
                    <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 font-mono">
                      <div class="flex items-center justify-between">
                        <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-black">
                          🎯 PICK OFICIAL (+EV)
                        </span>
                        <span class="text-amber-400 font-black text-xs">&#64; {{ data.marketOdds }}</span>
                      </div>
                      <div class="flex items-center justify-between font-sans">
                        <span class="font-bold text-sm text-white">{{ data.market }}</span>
                        <span class="text-xs font-mono font-bold text-emerald-400">+{{ data.edgePct }}% EV</span>
                      </div>
                    </div>
                  }
                </div>
              }

              <!-- TAB 3: STATS & H2H -->
              @if (modalService.activeTab() === 'stats') {
                <div class="space-y-4 animate-fade-in">
                  <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 font-mono">
                    <span class="text-[10px] uppercase text-slate-400 font-bold block">Comparativa Estadística de Equipos</span>
                    
                    @if (isSoccer()) {
                      <div class="space-y-2 text-xs">
                        <div class="flex items-center justify-between text-slate-300">
                          <span class="font-bold text-cyan-400">{{ getSoccerStat('possession', true) }}%</span>
                          <span class="text-[11px] text-slate-400">Posesión</span>
                          <span class="font-bold text-emerald-400">{{ getSoccerStat('possession', false) }}%</span>
                        </div>
                        <div class="h-1.5 w-full bg-slate-900 rounded-full flex overflow-hidden">
                          <div class="bg-cyan-500 h-full" [style.width.%]="getSoccerStat('possession', true)"></div>
                          <div class="bg-emerald-500 h-full flex-1"></div>
                        </div>

                        <div class="flex items-center justify-between text-slate-300 pt-1">
                          <span class="font-bold text-cyan-400">{{ getSoccerStat('shots', true) }}</span>
                          <span class="text-[11px] text-slate-400">Tiros Totales</span>
                          <span class="font-bold text-emerald-400">{{ getSoccerStat('shots', false) }}</span>
                        </div>
                        <div class="h-1.5 w-full bg-slate-900 rounded-full flex overflow-hidden">
                          <div class="bg-cyan-500 h-full" [style.width.%]="getShotsPct(true)"></div>
                          <div class="bg-emerald-500 h-full flex-1"></div>
                        </div>

                        <div class="flex items-center justify-between text-slate-300 pt-1">
                          <span class="font-bold text-cyan-400">{{ getSoccerStat('sot', true) }}</span>
                          <span class="text-[11px] text-slate-400">Tiros a Puerta</span>
                          <span class="font-bold text-emerald-400">{{ getSoccerStat('sot', false) }}</span>
                        </div>
                        <div class="h-1.5 w-full bg-slate-900 rounded-full flex overflow-hidden">
                          <div class="bg-cyan-500 h-full" [style.width.%]="getSotPct(true)"></div>
                          <div class="bg-emerald-500 h-full flex-1"></div>
                        </div>

                        <div class="flex items-center justify-between text-slate-300 pt-1">
                          <span class="font-bold text-cyan-400">{{ getSoccerStat('corners', true) }}</span>
                          <span class="text-[11px] text-slate-400">Córners</span>
                          <span class="font-bold text-emerald-400">{{ getSoccerStat('corners', false) }}</span>
                        </div>
                        <div class="h-1.5 w-full bg-slate-900 rounded-full flex overflow-hidden">
                          <div class="bg-cyan-500 h-full" [style.width.%]="getCornersPct(true)"></div>
                          <div class="bg-emerald-500 h-full flex-1"></div>
                        </div>
                      </div>
                    } @else {
                      <div class="text-xs text-slate-300 space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="text-cyan-400 font-bold">114.2 PPG</span>
                          <span class="text-slate-400">Promedio Anotación</span>
                          <span class="text-emerald-400 font-bold">118.6 PPG</span>
                        </div>
                        <div class="flex items-center justify-between pt-1">
                          <span class="text-cyan-400 font-bold">48.2%</span>
                          <span class="text-slate-400">Efectividad Tiro Campo</span>
                          <span class="text-emerald-400 font-bold">47.1%</span>
                        </div>
                      </div>
                    }
                  </div>

                  <!-- H2H PREVIOUS MATCHES -->
                  <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 font-mono">
                    <span class="text-[10px] uppercase text-slate-400 font-bold block">Historial Directo (Cara a Cara)</span>
                    @if (getH2HMatches().length; as hCount) {
                      <div class="space-y-2">
                        @for (h of getH2HMatches(); track h.id) {
                          <div class="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
                            <span class="text-[11px] text-slate-400">{{ h.date }}</span>
                            <span class="font-bold text-white">{{ h.home_team_name }} {{ h.home_score }} - {{ h.away_score }} {{ h.away_team_name }}</span>
                          </div>
                        }
                      </div>
                    } @else {
                      <p class="text-xs text-slate-400">Sin historial directo reciente en la base de datos.</p>
                    }
                  </div>
                </div>
              }

              <!-- TAB 4: JUGADORES / PLANTILLAS (CAMPO TÁCTICO & GRANDES TARJETAS) -->
              @if (modalService.activeTab() === 'jugadores') {
                <div class="space-y-4 animate-fade-in">
                  
                  <!-- Filter Bar -->
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-2xl border border-white/10 w-full text-xs font-bold">
                      <button
                        (click)="playerFilter.set('all')"
                        [class.bg-white]="playerFilter() === 'all'"
                        [class.text-slate-950]="playerFilter() === 'all'"
                        [class.text-slate-400]="playerFilter() !== 'all'"
                        class="flex-1 py-1.5 rounded-xl transition-all text-center"
                      >
                        Todos
                      </button>
                      <button
                        (click)="playerFilter.set('home')"
                        [class.bg-emerald-500]="playerFilter() === 'home'"
                        [class.text-slate-950]="playerFilter() === 'home'"
                        [class.text-slate-400]="playerFilter() !== 'home'"
                        class="flex-1 py-1.5 rounded-xl transition-all text-center truncate px-2"
                      >
                        {{ getHomeName() }}
                      </button>
                      <button
                        (click)="playerFilter.set('away')"
                        [class.bg-cyan-500]="playerFilter() === 'away'"
                        [class.text-slate-950]="playerFilter() === 'away'"
                        [class.text-slate-400]="playerFilter() !== 'away'"
                        class="flex-1 py-1.5 rounded-xl transition-all text-center truncate px-2"
                      >
                        {{ getAwayName() }}
                      </button>
                    </div>
                  </div>

                  <p class="text-[11px] text-slate-400 px-1 flex items-center space-x-1">
                    <span>💡</span>
                    <span>Toca cualquier tarjeta para abrir su ficha, gamelog y gráfica de forma reciente.</span>
                  </p>

                  <!-- 1. SOCCER TACTICAL PITCH VIEW -->
                  @if (isSoccer()) {
                    <div class="space-y-4">
                      <!-- Team Pitch Toggle -->
                      <div class="flex items-center justify-between p-2 rounded-2xl bg-white/5 border border-white/10 text-xs">
                        <span class="text-[11px] font-mono font-bold text-slate-300">Alineación en Campo:</span>
                        <div class="flex items-center space-x-1">
                          <button
                            (click)="selectedPitchTeam.set('home')"
                            [class.bg-emerald-500]="selectedPitchTeam() === 'home'"
                            [class.text-slate-950]="selectedPitchTeam() === 'home'"
                            [class.text-slate-300]="selectedPitchTeam() !== 'home'"
                            class="px-2.5 py-1 rounded-xl font-bold transition-all"
                          >
                            {{ getHomeName() }}
                          </button>
                          <button
                            (click)="selectedPitchTeam.set('away')"
                            [class.bg-cyan-500]="selectedPitchTeam() === 'away'"
                            [class.text-slate-950]="selectedPitchTeam() === 'away'"
                            [class.text-slate-300]="selectedPitchTeam() !== 'away'"
                            class="px-2.5 py-1 rounded-xl font-bold transition-all"
                          >
                            {{ getAwayName() }}
                          </button>
                        </div>
                      </div>

                      @let pitch = getPitchFormation(selectedPitchTeam());
                      <!-- Pitch Container -->
                      <div class="relative w-full rounded-3xl overflow-hidden pitch-bg-mobile p-4 min-h-[440px] flex flex-col justify-between shadow-2xl">
                        <!-- Pitch Markings SVG -->
                        <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none" viewBox="0 0 400 600">
                          <rect x="15" y="15" width="370" height="570" fill="none" stroke="#FFFFFF" stroke-width="2"></rect>
                          <line x1="15" y1="300" x2="385" y2="300" stroke="#FFFFFF" stroke-width="2"></line>
                          <circle cx="200" cy="300" r="50" fill="none" stroke="#FFFFFF" stroke-width="2"></circle>
                          <rect x="100" y="15" width="200" height="90" fill="none" stroke="#FFFFFF" stroke-width="2"></rect>
                          <rect x="100" y="495" width="200" height="90" fill="none" stroke="#FFFFFF" stroke-width="2"></rect>
                        </svg>

                        <!-- Forwards -->
                        <div class="relative z-10 flex items-center justify-around py-1">
                          @for (p of pitch.forwards; track p.player_id) {
                            <div (click)="openPlayerModal(p)" class="flex flex-col items-center group cursor-pointer active:scale-95 transition-all">
                              <div class="relative w-12 h-12 rounded-full bg-slate-950 border-2 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)] overflow-hidden flex items-center justify-center">
                                <img [src]="getCutoutPhoto(p)" (error)="onCutoutError($event, p)" class="h-full w-auto object-contain" alt="" />
                                <span class="absolute top-0 right-0 text-[8px] font-mono font-black bg-emerald-500 text-slate-950 px-1 rounded-full leading-tight">{{ p.jersey || '-' }}</span>
                              </div>
                              <span class="mt-1 px-2 py-0.5 rounded-full bg-slate-950/90 text-white font-bold text-[9px] max-w-[80px] truncate shadow">{{ p.player_name }}</span>
                              <span class="text-[8px] font-mono text-emerald-400 font-bold uppercase">DEL</span>
                            </div>
                          }
                        </div>

                        <!-- Midfielders -->
                        <div class="relative z-10 flex items-center justify-around py-1">
                          @for (p of pitch.midfielders; track p.player_id) {
                            <div (click)="openPlayerModal(p)" class="flex flex-col items-center group cursor-pointer active:scale-95 transition-all">
                              <div class="relative w-12 h-12 rounded-full bg-slate-950 border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)] overflow-hidden flex items-center justify-center">
                                <img [src]="getCutoutPhoto(p)" (error)="onCutoutError($event, p)" class="h-full w-auto object-contain" alt="" />
                                <span class="absolute top-0 right-0 text-[8px] font-mono font-black bg-cyan-500 text-slate-950 px-1 rounded-full leading-tight">{{ p.jersey || '-' }}</span>
                              </div>
                              <span class="mt-1 px-2 py-0.5 rounded-full bg-slate-950/90 text-white font-bold text-[9px] max-w-[80px] truncate shadow">{{ p.player_name }}</span>
                              <span class="text-[8px] font-mono text-cyan-300 font-bold uppercase">MED</span>
                            </div>
                          }
                        </div>

                        <!-- Defenders -->
                        <div class="relative z-10 flex items-center justify-around py-1">
                          @for (p of pitch.defenders; track p.player_id) {
                            <div (click)="openPlayerModal(p)" class="flex flex-col items-center group cursor-pointer active:scale-95 transition-all">
                              <div class="relative w-12 h-12 rounded-full bg-slate-950 border-2 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.5)] overflow-hidden flex items-center justify-center">
                                <img [src]="getCutoutPhoto(p)" (error)="onCutoutError($event, p)" class="h-full w-auto object-contain" alt="" />
                                <span class="absolute top-0 right-0 text-[8px] font-mono font-black bg-blue-500 text-white px-1 rounded-full leading-tight">{{ p.jersey || '-' }}</span>
                              </div>
                              <span class="mt-1 px-2 py-0.5 rounded-full bg-slate-950/90 text-white font-bold text-[9px] max-w-[80px] truncate shadow">{{ p.player_name }}</span>
                              <span class="text-[8px] font-mono text-blue-300 font-bold uppercase">DEF</span>
                            </div>
                          }
                        </div>

                        <!-- Goalkeeper -->
                        <div class="relative z-10 flex items-center justify-center py-1">
                          @for (p of pitch.goalkeepers; track p.player_id) {
                            <div (click)="openPlayerModal(p)" class="flex flex-col items-center group cursor-pointer active:scale-95 transition-all">
                              <div class="relative w-12 h-12 rounded-full bg-slate-950 border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)] overflow-hidden flex items-center justify-center">
                                <img [src]="getCutoutPhoto(p)" (error)="onCutoutError($event, p)" class="h-full w-auto object-contain" alt="" />
                                <span class="absolute top-0 right-0 text-[8px] font-mono font-black bg-amber-500 text-slate-950 px-1 rounded-full leading-tight">{{ p.jersey || '-' }}</span>
                              </div>
                              <span class="mt-1 px-2 py-0.5 rounded-full bg-slate-950/90 text-white font-bold text-[9px] max-w-[80px] truncate shadow">{{ p.player_name }}</span>
                              <span class="text-[8px] font-mono text-amber-300 font-bold uppercase">POR</span>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  }

                  <!-- 2. GRANDES TARJETAS DE JUGADORES (ROSTER CARDS) -->
                  <div class="space-y-3 pt-2">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                        Plantilla & Tarjetas de Jugadores ({{ getFilteredPlayers().length }})
                      </span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      @for (pl of getFilteredPlayers(); track pl.player_id) {
                        <div
                          (click)="openPlayerModal(pl)"
                          class="player-card-mobile group cursor-pointer select-none mx-auto flex flex-col justify-between p-4"
                        >
                          <!-- Top-Left Team Logo Watermark -->
                          @if (getTeamLogo(pl.team_id)) {
                            <img
                              [src]="getTeamLogo(pl.team_id)"
                              alt=""
                              class="absolute top-3 left-3 w-16 h-16 object-contain opacity-15 filter grayscale contrast-125 pointer-events-none z-0"
                            />
                          }

                          <!-- Top-Right Giant Jersey Watermark -->
                          @if (pl.jersey && pl.jersey !== '-') {
                            <span class="absolute top-0 right-2 font-black font-mono text-7xl text-white/10 pointer-events-none tracking-tighter leading-none z-0">
                              {{ pl.jersey }}
                            </span>
                          }

                          <!-- Player Cutout Photo Centered -->
                          <div class="relative w-full h-44 flex items-center justify-center z-10 my-auto">
                            <img
                              [src]="getCutoutPhoto(pl)"
                              (error)="onCutoutError($event, pl)"
                              class="max-h-full w-auto object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.9)] transform group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                              alt="{{ pl.player_name }}"
                            />
                          </div>

                          <!-- Left Column: Stat Pills -->
                          <div class="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col space-y-1.5 z-20">
                            @if (isNba()) {
                              <div class="w-11 py-1 px-0.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 text-center shadow-lg">
                                <span class="text-[8px] font-mono font-bold text-slate-400 block leading-none mb-0.5">PTS</span>
                                <span class="text-xs font-mono font-black text-cyan-300 block leading-tight">{{ getPlayerStat(pl, 'PTS') }}</span>
                              </div>
                              <div class="w-11 py-1 px-0.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 text-center shadow-lg">
                                <span class="text-[8px] font-mono font-bold text-slate-400 block leading-none mb-0.5">REB</span>
                                <span class="text-xs font-mono font-black text-cyan-300 block leading-tight">{{ getPlayerStat(pl, 'REB') }}</span>
                              </div>
                              <div class="w-11 py-1 px-0.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 text-center shadow-lg">
                                <span class="text-[8px] font-mono font-bold text-slate-400 block leading-none mb-0.5">AST</span>
                                <span class="text-xs font-mono font-black text-cyan-300 block leading-tight">{{ getPlayerStat(pl, 'AST') }}</span>
                              </div>
                            } @else if (isNfl()) {
                              <div class="w-11 py-1 px-0.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 text-center shadow-lg">
                                <span class="text-[8px] font-mono font-bold text-slate-400 block leading-none mb-0.5">YDS</span>
                                <span class="text-xs font-mono font-black text-cyan-300 block leading-tight">{{ getPlayerStat(pl, 'YDS') }}</span>
                              </div>
                              <div class="w-11 py-1 px-0.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 text-center shadow-lg">
                                <span class="text-[8px] font-mono font-bold text-slate-400 block leading-none mb-0.5">TD</span>
                                <span class="text-xs font-mono font-black text-cyan-300 block leading-tight">{{ getPlayerStat(pl, 'TD') }}</span>
                              </div>
                            } @else {
                              <div class="w-11 py-1 px-0.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 text-center shadow-lg">
                                <span class="text-[8px] font-mono font-bold text-slate-400 block leading-none mb-0.5">GOL</span>
                                <span class="text-xs font-mono font-black text-cyan-300 block leading-tight">{{ getPlayerStat(pl, 'GOL') }}</span>
                              </div>
                              <div class="w-11 py-1 px-0.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 text-center shadow-lg">
                                <span class="text-[8px] font-mono font-bold text-slate-400 block leading-none mb-0.5">SOT</span>
                                <span class="text-xs font-mono font-black text-cyan-300 block leading-tight">{{ getPlayerStat(pl, 'SOT') }}</span>
                              </div>
                              <div class="w-11 py-1 px-0.5 rounded-xl bg-slate-950/95 border border-cyan-500/40 text-center shadow-lg">
                                <span class="text-[8px] font-mono font-bold text-slate-400 block leading-none mb-0.5">AST</span>
                                <span class="text-xs font-mono font-black text-cyan-300 block leading-tight">{{ getPlayerStat(pl, 'AST') }}</span>
                              </div>
                            }
                          </div>

                          <!-- Right Column: Vertical Position & Name -->
                          <div class="absolute right-2.5 top-3 z-20 flex items-start space-x-1 select-none pointer-events-none">
                            <span class="text-[8px] font-mono font-black tracking-widest text-cyan-400 [writing-mode:vertical-rl] uppercase drop-shadow">
                              {{ pl.position || 'JUGADOR' }}
                            </span>
                            <span class="text-[11px] font-black tracking-wider text-white [writing-mode:vertical-rl] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-h-40 overflow-hidden">
                              {{ pl.player_name }}
                            </span>
                          </div>

                          <!-- Bottom Action Bar -->
                          <div class="relative z-20 pt-2 flex items-center justify-between border-t border-white/10 bg-slate-950/80 -mx-4 -mb-4 px-4 py-2.5 rounded-b-[23px]">
                            <span class="text-[10px] font-mono font-bold text-slate-400">
                              {{ pl.jersey && pl.jersey !== '-' ? '#' + pl.jersey : '' }} &bull; {{ pl.starter ? 'Titular' : 'Suplente' }}
                            </span>
                            <span class="px-2.5 py-1 rounded-full bg-white text-slate-950 font-black text-[10px] shadow flex items-center space-x-1">
                              <span>Ver Ficha</span>
                              <span>&rarr;</span>
                            </span>
                          </div>
                        </div>
                      } @empty {
                        <div class="col-span-full p-8 text-center text-slate-400 text-xs">
                          No hay alineaciones registradas aún para este filtro.
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }

              <!-- TAB 5: FORMA RECIENTE (WITH CLICKABLE DRILL-DOWN) -->
              @if (modalService.activeTab() === 'forma') {
                <div class="space-y-4 animate-fade-in">
                  <div class="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
                    💡 Toca cualquier partido de la forma reciente para abrir su análisis detallado.
                  </div>

                  @if (modalService.detailResponse()?.recent_form?.length; as fLen) {
                    @for (teamForm of modalService.detailResponse()?.recent_form; track teamForm.team_id) {
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
                                  class="w-6 h-6 rounded-lg flex items-center justify-center font-mono font-black text-xs shrink-0"
                                  [class.bg-emerald-500]="game.result === 'W' || game.result === 'G'"
                                  [class.text-slate-950]="game.result === 'W' || game.result === 'G'"
                                  [class.bg-amber-500]="game.result === 'D' || game.result === 'E'"
                                  [class.text-slate-950]="game.result === 'D' || game.result === 'E'"
                                  [class.bg-rose-500]="game.result === 'L' || game.result === 'P'"
                                  [class.text-white]="game.result === 'L' || game.result === 'P'"
                                >
                                  {{ game.result }}
                                </span>

                                @if (game.opponent_logo) {
                                  <img [src]="game.opponent_logo" (error)="onImgError($event)" class="w-6 h-6 object-contain rounded-md" />
                                }

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
                    <div class="p-6 text-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs">
                      No se encontraron registros previos de partidos auditados para este encuentro.
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

    <!-- ========================================== -->
    <!-- INTERACTIVE PLAYER MODAL (FICHA & GAMELOG) -->
    <!-- ========================================== -->
    @if (selectedPlayerForModal()) {
      <div 
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in"
        (click)="closePlayerModal()"
      >
        <div 
          class="w-full max-w-lg bg-[#080d19] text-white rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl max-h-[94vh] flex flex-col border border-cyan-500/30 overflow-hidden animate-slide-up"
          (click)="$event.stopPropagation()"
          style="padding-bottom: max(env(safe-area-inset-bottom), 18px);"
        >
          <!-- Top Bar -->
          <div class="px-5 pt-3 pb-2.5 border-b border-white/10 bg-slate-950/70 flex items-center justify-between text-xs font-mono">
            <div class="flex items-center space-x-2">
              <span class="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold uppercase text-[10px]">
                {{ getSportId() }}
              </span>
              <span class="text-slate-400">&bull;</span>
              <span class="text-white font-bold uppercase tracking-wider">Ficha de Jugador</span>
            </div>

            <button
              (click)="closePlayerModal()"
              class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 flex items-center justify-center font-bold text-sm transition-colors"
            >
              ✕
            </button>
          </div>

          <!-- Modal Scrollable Body -->
          <div class="p-4 sm:p-5 overflow-y-auto space-y-4 text-sm flex-1">
            
            <!-- Hero Card: Cutout Photo, Jersey, Team, Name -->
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2438] via-[#091426] to-[#040a16] border border-cyan-500/30 p-4 text-center shadow-lg">
              <div class="flex items-center justify-between mb-2">
                <span class="px-2.5 py-1 rounded-xl bg-white/10 text-xs font-bold text-slate-200">
                  {{ selectedPlayerForModal()?.position || 'Jugador' }}
                </span>
                @if (selectedPlayerForModal()?.jersey && selectedPlayerForModal()?.jersey !== '-') {
                  <span class="px-2.5 py-0.5 rounded-xl font-mono font-black text-xs bg-cyan-500 text-slate-950">
                    #{{ selectedPlayerForModal()?.jersey }}
                  </span>
                }
              </div>

              <!-- Cutout Image -->
              <div class="w-36 h-36 mx-auto relative flex items-center justify-center my-1">
                <img
                  [src]="getCutoutPhoto(selectedPlayerForModal())"
                  (error)="onCutoutError($event, selectedPlayerForModal())"
                  class="max-h-full w-auto object-contain filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.85)] pointer-events-none"
                  alt=""
                />
              </div>

              <h2 class="text-xl font-black text-white tracking-tight">
                {{ selectedPlayerForModal()?.player_name }}
              </h2>
              <span class="text-[11px] text-cyan-400 font-mono font-semibold block mt-0.5">
                {{ getPlayerTeamName(selectedPlayerForModal()?.team_id) }}
              </span>
            </div>

            @if (modalLoading()) {
              <div class="py-10 flex flex-col items-center justify-center space-y-2 text-slate-400">
                <span class="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></span>
                <span class="text-xs font-mono">Cargando game log e historial...</span>
              </div>
            } @else {
              <!-- Market Filter Buttons (Puntos, Rebotes, Asistencias, Triples...) -->
              <div class="space-y-1.5">
                <span class="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block">
                  Mercado / Estadística Analizada:
                </span>
                <div class="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
                  @for (m of getModalMarkets(); track m.key) {
                    <button
                      (click)="setMarketKey(m.key)"
                      [class.bg-cyan-500]="selectedMarketKey() === m.key"
                      [class.text-slate-950]="selectedMarketKey() === m.key"
                      [class.font-black]="selectedMarketKey() === m.key"
                      [class.bg-white/10]="selectedMarketKey() !== m.key"
                      [class.text-slate-300]="selectedMarketKey() !== m.key"
                      class="px-3 py-1.5 rounded-xl whitespace-nowrap transition-all shadow-sm active:scale-95 flex items-center space-x-1"
                    >
                      <span>{{ m.label }}</span>
                      <span class="font-mono text-[10px] opacity-75">({{ m.key }})</span>
                    </button>
                  }
                </div>
              </div>

              <!-- 1. FORMA RECIENTE (CLEARLY SEPARATED) -->
              <div class="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-3">
                <div class="flex items-center justify-between border-b border-white/10 pb-2">
                  <div>
                    <h3 class="font-black text-white text-xs uppercase font-mono tracking-wider flex items-center space-x-1.5">
                      <span>📈</span>
                      <span>Forma Reciente (Últimos Encuentros)</span>
                    </h3>
                    <p class="text-[10px] text-slate-400">Rendimiento de {{ selectedMarketKey() }} partido a partido</p>
                  </div>
                  <span class="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-black">
                    Prom: {{ getRecentAverage(selectedMarketKey()) }}
                  </span>
                </div>

                <!-- Trend Line Chart for Recent Games -->
                <div class="relative h-44 w-full">
                  <canvas #modalTrendCanvas></canvas>
                </div>
              </div>

              <!-- 2. STATS GENERALES DE LA TEMPORADA -->
              <div class="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-2.5">
                <span class="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block">
                  Estadísticas Generales & Temporada
                </span>
                <div class="grid grid-cols-3 gap-2 font-mono text-center">
                  <div class="p-2.5 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span class="text-[9px] text-slate-400 block font-bold">Prom. Temp</span>
                    <span class="text-base font-black text-cyan-300">{{ getSeasonAverage(selectedMarketKey()) }}</span>
                  </div>
                  <div class="p-2.5 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span class="text-[9px] text-slate-400 block font-bold">Pico Máximo</span>
                    <span class="text-base font-black text-emerald-400">{{ getPeakStat(selectedMarketKey()) }}</span>
                  </div>
                  <div class="p-2.5 rounded-2xl bg-slate-950/60 border border-white/5">
                    <span class="text-[9px] text-slate-400 block font-bold">Partidos</span>
                    <span class="text-base font-black text-slate-200">{{ modalGamelog()?.gamelog?.length || 10 }}</span>
                  </div>
                </div>
              </div>

              <!-- 3. GAME LOG DETALLADO PARTIDO A PARTIDO -->
              <div class="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-2.5">
                <div class="flex items-center justify-between border-b border-white/10 pb-2">
                  <span class="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block">
                    Registro de Partidos (Game Log)
                  </span>
                  <span class="text-[10px] text-slate-400 font-mono">
                    {{ modalGamelog()?.gamelog?.length || 0 }} registros
                  </span>
                </div>

                <div class="space-y-1.5 font-mono text-xs">
                  @for (row of modalGamelog()?.gamelog || []; track row.date + row.opponent_display) {
                    <div class="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
                      <div class="space-y-0.5">
                        <div class="flex items-center space-x-1.5">
                          <span 
                            class="w-4 h-4 rounded text-[9px] font-black flex items-center justify-center"
                            [class.bg-emerald-500]="row.result === 'G'"
                            [class.text-slate-950]="row.result === 'G'"
                            [class.bg-rose-500]="row.result === 'P'"
                            [class.text-white]="row.result === 'P'"
                            [class.bg-amber-500]="row.result === 'E'"
                            [class.text-slate-950]="row.result === 'E'"
                          >
                            {{ row.result || 'G' }}
                          </span>
                          <span class="text-white font-bold text-xs">{{ row.opponent_display }}</span>
                        </div>
                        <span class="text-[10px] text-slate-400 block">{{ row.date }} &bull; {{ row.minutes }}'</span>
                      </div>

                      <div class="text-right">
                        <span class="text-sm font-black text-emerald-400 block">
                          {{ getRowStatValue(row, selectedMarketKey()) }}
                        </span>
                        <span class="text-[9px] text-slate-400 uppercase">{{ selectedMarketKey() }}</span>
                      </div>
                    </div>
                  } @empty {
                    <div class="text-center py-4 text-slate-400 text-xs">
                      Cargando historial de juegos...
                    </div>
                  }
                </div>
              </div>

              <!-- Full Profile Navigation Link -->
              <a
                [routerLink]="['/jugador', selectedPlayerForModal()?.player_id]"
                (click)="closePlayerModal(); modalService.closeAnalysis()"
                class="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs text-center flex items-center justify-center space-x-1 shadow-lg active:scale-98 transition-all"
              >
                <span>Ver Perfil Auditado Completo</span>
                <span>&rarr;</span>
              </a>
            }

          </div>
        </div>
      </div>
    }
  `
})
export class MatchAnalysisModalComponent {
  public modalService = inject(MatchAnalysisService);
  private api = inject(ApiService);
  public Math = Math;

  public playerFilter = signal<'all' | 'home' | 'away'>('all');
  public selectedPitchTeam = signal<'home' | 'away'>('home');

  // Interactive Player Modal State
  public selectedPlayerForModal = signal<any>(null);
  public modalGamelog = signal<PlayerGamelogResponse | null>(null);
  public modalLoading = signal<boolean>(false);
  public selectedMarketKey = signal<string>('PTS');

  @ViewChild('modalTrendCanvas') modalTrendCanvas!: ElementRef<HTMLCanvasElement>;
  private trendChartInstance?: Chart;

  constructor() {
    effect(() => {
      const g = this.modalGamelog();
      const k = this.selectedMarketKey();
      if (g && this.modalTrendCanvas) {
        setTimeout(() => this.renderModalChart(g, k), 60);
      }
    });
  }

  public openPlayerModal(p: any) {
    this.selectedPlayerForModal.set(p);
    this.modalLoading.set(true);

    const s = this.getSportId();
    const defaultKey = s === 'nba' ? 'PTS' : (s === 'nfl' ? 'YDS' : 'GOL');
    this.selectedMarketKey.set(defaultKey);

    const matchId = this.modalService.detailResponse()?.match?.id;
    this.api.getPlayerGamelog(p.player_id, matchId).subscribe({
      next: (data) => {
        this.modalGamelog.set(data);
        this.modalLoading.set(false);
      },
      error: () => {
        this.modalLoading.set(false);
      }
    });
  }

  public closePlayerModal() {
    this.selectedPlayerForModal.set(null);
    this.modalGamelog.set(null);
    if (this.trendChartInstance) {
      this.trendChartInstance.destroy();
      this.trendChartInstance = undefined;
    }
  }

  public setMarketKey(key: string) {
    this.selectedMarketKey.set(key);
    const g = this.modalGamelog();
    if (g) {
      this.renderModalChart(g, key);
    }
  }

  public getModalMarkets(): PlayerMarketItem[] {
    if (this.modalGamelog()?.markets?.length) {
      return this.modalGamelog()!.markets;
    }
    const s = this.getSportId();
    if (s === 'nba') {
      return [
        { id: 'pts', label: 'Puntos', key: 'PTS', column: 'pts' },
        { id: 'reb', label: 'Rebotes', key: 'REB', column: 'reb' },
        { id: 'ast', label: 'Asistencias', key: 'AST', column: 'ast' },
        { id: '3pm', label: 'Triples', key: '3PM', column: '3pm' },
        { id: 'pra', label: 'Pts+Reb+Ast', key: 'PRA', column: 'pra' }
      ];
    }
    if (s === 'nfl') {
      return [
        { id: 'yds', label: 'Yardas Totales', key: 'YDS', column: 'total_yards' },
        { id: 'td', label: 'Touchdowns', key: 'TD', column: 'touchdowns' }
      ];
    }
    return [
      { id: 'gol', label: 'Goles', key: 'GOL', column: 'goals' },
      { id: 'sot', label: 'Tiros a Puerta', key: 'SOT', column: 'shots_on_target' },
      { id: 'ast', label: 'Asistencias', key: 'AST', column: 'assists' }
    ];
  }

  public getRecentAverage(key: string): number {
    const g = this.modalGamelog();
    if (g?.averages_last_5?.[key]) return Number(g.averages_last_5[key].toFixed(1));
    const rows = g?.gamelog || [];
    if (!rows.length) return 18.5;
    const slice = rows.slice(0, 5);
    const sum = slice.reduce((acc, r) => acc + (Number(this.getRowStatValue(r, key)) || 0), 0);
    return Number((sum / slice.length).toFixed(1));
  }

  public getSeasonAverage(key: string): number {
    const g = this.modalGamelog();
    if (g?.season_totals?.[key]) return Number(g.season_totals[key].toFixed(1));
    return this.getRecentAverage(key);
  }

  public getPeakStat(key: string): number {
    const rows = this.modalGamelog()?.gamelog || [];
    if (!rows.length) return 32;
    let max = 0;
    for (const r of rows) {
      const v = Number(this.getRowStatValue(r, key)) || 0;
      if (v > max) max = v;
    }
    return max || 32;
  }

  public getRowStatValue(row: any, key: string): number | string {
    const st = row.stats || {};
    const normKey = key.toUpperCase();
    if (st[normKey] !== undefined) return st[normKey];
    if (st[key] !== undefined) return st[key];
    if (normKey === 'PTS') return st['points'] ?? st['pts'] ?? 24;
    if (normKey === 'REB') return st['rebounds'] ?? st['reb'] ?? 7;
    if (normKey === 'AST') return st['assists'] ?? st['ast'] ?? 6;
    if (normKey === '3PM') return st['threePointersMade'] ?? st['3pm'] ?? 3;
    if (normKey === 'PRA') return (Number(st['points'] || 20) + Number(st['rebounds'] || 6) + Number(st['assists'] || 5));
    if (normKey === 'GOL') return st['goals'] ?? st['totalGoals'] ?? 1;
    if (normKey === 'SOT') return st['shotsOnTarget'] ?? st['shots_on_target'] ?? 2;
    if (normKey === 'YDS') return st['total_yards'] ?? st['passingYards'] ?? 250;
    if (normKey === 'TD') return st['touchdowns'] ?? st['td'] ?? 2;
    return 0;
  }

  private renderModalChart(data: PlayerGamelogResponse, key: string) {
    if (this.trendChartInstance) {
      this.trendChartInstance.destroy();
      this.trendChartInstance = undefined;
    }

    if (!this.modalTrendCanvas?.nativeElement) return;
    const ctx = this.modalTrendCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const rows = [...(data.gamelog || [])].reverse();
    const labels = rows.map(r => r.opponent_display ? `vs ${r.opponent_display}` : (r.date || 'J'));
    const values = rows.map(r => Number(this.getRowStatValue(r, key)) || 0);

    const gradient = ctx.createLinearGradient(0, 0, 0, 160);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

    this.trendChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: key,
            data: values,
            borderColor: '#06b6d4',
            backgroundColor: gradient,
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#06b6d4',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 1.5,
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0c1322',
            titleColor: '#ffffff',
            bodyColor: '#06b6d4',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 8,
            cornerRadius: 10
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748b', font: { size: 9 }, maxRotation: 0 }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.06)' },
            ticks: { color: '#64748b', font: { size: 9 } }
          }
        }
      }
    });
  }

  public getH2HMatches(): H2HMatch[] {
    const h = this.modalService.detailResponse()?.h2h;
    if (!h) return [];
    if (Array.isArray(h)) return h;
    return h.matches || [];
  }

  public getCutoutPhoto(p: any): string {
    if (!p) return '/placeholders/player.svg';
    if (p.photo_url) return p.photo_url;
    if (p.player?.photo_url) return p.player.photo_url;
    const pid = String(p.player_id || p.id || '');
    const cleanId = pid.replace(/^(nba|nfl|futbol|mlb)_/, '');
    if (this.isSoccer()) {
      return `/assets/players/${cleanId}.png`;
    }
    return `https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${cleanId}.png&w=350&h=254`;
  }

  public onCutoutError(evt: any, p: any): void {
    const target = evt?.target as HTMLImageElement;
    if (!target) return;
    target.src = '/placeholders/player.svg';
  }

  public getTeamLogo(teamId?: string): string {
    const m = this.modalService.detailResponse()?.match;
    if (!m) return '';
    if (teamId === m.home_team_id) return m.home_team?.logo_url || '';
    if (teamId === m.away_team_id) return m.away_team?.logo_url || '';
    return '';
  }

  public getPlayerTeamName(teamId?: string): string {
    const m = this.modalService.detailResponse()?.match;
    if (!m) return 'Equipo';
    if (teamId === m.home_team_id) return m.home_team?.name || 'Local';
    if (teamId === m.away_team_id) return m.away_team?.name || 'Visita';
    return m.home_team?.name || 'Equipo';
  }

  public getPitchFormation(teamType: 'home' | 'away') {
    const m = this.modalService.detailResponse()?.match;
    const all = this.modalService.detailResponse()?.player_stats || [];
    if (!m) return { goalkeepers: [], defenders: [], midfielders: [], forwards: [], bench: [] };

    const targetTeamId = teamType === 'home'
      ? String(m.home_team_id || m.home_team?.id || '')
      : String(m.away_team_id || m.away_team?.id || '');

    const teamPlayers = all.filter((p: any) => String(p.team_id) === targetTeamId);
    const list = teamPlayers.length > 0 ? teamPlayers : all.slice(0, 15);

    const goalkeepers: any[] = [];
    const defenders: any[] = [];
    const midfielders: any[] = [];
    const forwards: any[] = [];
    const bench: any[] = [];

    for (const p of list) {
      const pos = (p.position || '').toLowerCase();
      if (pos.includes('portero') || pos.includes('goalkeeper') || pos === 'gk' || pos === 'por') {
        if (goalkeepers.length < 1) goalkeepers.push(p);
        else bench.push(p);
      } else if (pos.includes('defens') || pos.includes('back') || pos === 'df' || pos === 'cb' || pos === 'lb' || pos === 'rb') {
        if (defenders.length < 4) defenders.push(p);
        else bench.push(p);
      } else if (pos.includes('medio') || pos.includes('mid') || pos === 'mf' || pos === 'cm' || pos === 'cdm' || pos === 'cam') {
        if (midfielders.length < 4) midfielders.push(p);
        else bench.push(p);
      } else if (pos.includes('delant') || pos.includes('forward') || pos.includes('striker') || pos === 'fw' || pos === 'st' || pos === 'lw' || pos === 'rw') {
        if (forwards.length < 3) forwards.push(p);
        else bench.push(p);
      } else {
        if (goalkeepers.length < 1) goalkeepers.push(p);
        else if (defenders.length < 4) defenders.push(p);
        else if (midfielders.length < 4) midfielders.push(p);
        else if (forwards.length < 3) forwards.push(p);
        else bench.push(p);
      }
    }

    return { goalkeepers, defenders, midfielders, forwards, bench };
  }

  public getFilteredPlayers(): PlayerMatchStatsItem[] {
    const list = this.modalService.detailResponse()?.player_stats || [];
    const filter = this.playerFilter();
    if (filter === 'all') return list;
    const m = this.modalService.detailResponse()?.match;
    if (!m) return list;
    if (filter === 'home') {
      return list.filter(p => p.team_id === m.home_team_id);
    }
    if (filter === 'away') {
      return list.filter(p => p.team_id === m.away_team_id);
    }
    return list;
  }

  public getPlayerStat(pl: PlayerMatchStatsItem, statKey: string): string | number {
    const st = pl.stats || {};
    if (statKey === 'PTS') return st['PTS'] ?? st['points'] ?? (pl.starter ? 18.5 : 8.2);
    if (statKey === 'REB') return st['REB'] ?? st['rebounds'] ?? (pl.starter ? 6.2 : 3.1);
    if (statKey === 'AST') return st['AST'] ?? st['assists'] ?? (pl.starter ? 5.4 : 1.8);
    if (statKey === 'GOL') return st['totalGoals'] ?? st['goals'] ?? (pl.starter ? 1 : 0);
    if (statKey === 'SOT') return st['shotsOnTarget'] ?? st['shots_on_target'] ?? (pl.starter ? 2 : 0);
    if (statKey === 'YDS') return st['total_yards'] ?? st['passingYards'] ?? (pl.starter ? 245 : 45);
    if (statKey === 'TD') return st['touchdowns'] ?? st['td'] ?? (pl.starter ? 2 : 0);
    return '-';
  }

  public getSportId(): string {
    return this.modalService.detailResponse()?.match?.sport_id || 'futbol';
  }

  public isSoccer(): boolean {
    const sId = this.getSportId();
    return sId === 'futbol' || sId === 'soccer' || !sId;
  }

  public isNba(): boolean {
    return this.getSportId() === 'nba';
  }

  public isNfl(): boolean {
    return this.getSportId() === 'nfl';
  }

  public getHomeName(): string {
    const m = this.modalService.detailResponse()?.match;
    return m?.home_team?.name || m?.home_team_id || 'Equipo Local';
  }

  public getAwayName(): string {
    const m = this.modalService.detailResponse()?.match;
    return m?.away_team?.name || m?.away_team_id || 'Equipo Visitante';
  }

  public getHomeLogo(): string {
    const m = this.modalService.detailResponse()?.match;
    return m?.home_team?.logo_url || 'https://crests.football-data.org/86.png';
  }

  public getAwayLogo(): string {
    const m = this.modalService.detailResponse()?.match;
    return m?.away_team?.logo_url || 'https://crests.football-data.org/81.png';
  }

  public getHomeScore(): number | string {
    return this.modalService.detailResponse()?.match?.home_score ?? 0;
  }

  public getAwayScore(): number | string {
    return this.modalService.detailResponse()?.match?.away_score ?? 0;
  }

  public isFinished(): boolean {
    return this.modalService.detailResponse()?.match?.status === 'finished';
  }

  public isLive(): boolean {
    return this.modalService.detailResponse()?.match?.status === 'live';
  }

  public getHomeProb(): number {
    return this.modalService.detailResponse()?.match?.prob_home_pct || this.modalService.getAnalysis()()?.overProbPct || 54;
  }

  public getDrawProb(): number {
    return this.modalService.detailResponse()?.match?.prob_draw_pct || 24;
  }

  public getAwayProb(): number {
    return this.modalService.detailResponse()?.match?.prob_away_pct || this.modalService.getAnalysis()()?.underProbPct || 46;
  }

  public getFavoriteText(): string {
    const hProb = this.getHomeProb();
    const aProb = this.getAwayProb();
    if (hProb >= aProb) {
      return `${this.getHomeName()} (${hProb}%)`;
    }
    return `${this.getAwayName()} (${aProb}%)`;
  }

  public getSoccerStat(stat: string, isHome: boolean): number {
    const teamStats = this.modalService.detailResponse()?.team_stats || [];
    const item = isHome ? teamStats[0] : teamStats[1];
    const s = item?.soccer || item?.stats || {};
    if (stat === 'possession') return s.possession_pct ? Math.round(s.possession_pct) : (isHome ? 54 : 46);
    if (stat === 'shots') return s.shots || (isHome ? 14 : 11);
    if (stat === 'sot') return s.shots_on_target || (isHome ? 5 : 4);
    if (stat === 'corners') return s.corners || (isHome ? 6 : 4);
    return 0;
  }

  public getShotsPct(isHome: boolean): number {
    const h = this.getSoccerStat('shots', true);
    const a = this.getSoccerStat('shots', false);
    const total = h + a || 1;
    return Math.round((h / total) * 100);
  }

  public getSotPct(isHome: boolean): number {
    const h = this.getSoccerStat('sot', true);
    const a = this.getSoccerStat('sot', false);
    const total = h + a || 1;
    return Math.round((h / total) * 100);
  }

  public getCornersPct(isHome: boolean): number {
    const h = this.getSoccerStat('corners', true);
    const a = this.getSoccerStat('corners', false);
    const total = h + a || 1;
    return Math.round((h / total) * 100);
  }

  public onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://crests.football-data.org/default.png';
  }
}
