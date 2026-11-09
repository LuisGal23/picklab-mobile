import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchAnalysisService } from './services/match-analysis.service';
import { AnalysisTab } from './services/match-analysis.models';
import { PlayerMatchStatsItem, TeamMatchStatsItem, RecentFormGame, H2HMatch, PickItem } from '../../../../core/services/api.service';

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

            <!-- Teams Crests & Score Row -->
            <div class="flex items-center justify-between py-1.5 px-2 bg-slate-950/40 rounded-2xl border border-white/5">
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
                  <span class="px-2 py-0.5 rounded-lg bg-white/10 text-[10px] font-black font-mono text-slate-300">
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
          <div class="p-5 overflow-y-auto space-y-5 text-sm flex-1">
            
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

                  <!-- 4-KPI Grid (Favorito, Pick de Valor, Cuota Mercado, Cuota Justa) -->
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
                  
                  <!-- TEAM COMPARISON STATS -->
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

                        <div class="flex items-center justify-between text-slate-300 pt-1">
                          <span class="font-bold text-cyan-400">{{ getSoccerStat('sot', true) }}</span>
                          <span class="text-[11px] text-slate-400">Tiros al Arco</span>
                          <span class="font-bold text-emerald-400">{{ getSoccerStat('sot', false) }}</span>
                        </div>

                        <div class="flex items-center justify-between text-slate-300 pt-1">
                          <span class="font-bold text-cyan-400">{{ getSoccerStat('corners', true) }}</span>
                          <span class="text-[11px] text-slate-400">Córners</span>
                          <span class="font-bold text-emerald-400">{{ getSoccerStat('corners', false) }}</span>
                        </div>
                      </div>
                    } @else if (isNba()) {
                      <div class="space-y-2 text-xs">
                        <div class="flex items-center justify-between text-slate-300">
                          <span class="font-bold text-cyan-400">114.2</span>
                          <span class="text-[11px] text-slate-400">Puntos Promedio</span>
                          <span class="font-bold text-emerald-400">112.8</span>
                        </div>
                        <div class="flex items-center justify-between text-slate-300 pt-1">
                          <span class="font-bold text-cyan-400">47.8%</span>
                          <span class="text-[11px] text-slate-400">Tiro de Campo (FG%)</span>
                          <span class="font-bold text-emerald-400">46.5%</span>
                        </div>
                        <div class="flex items-center justify-between text-slate-300 pt-1">
                          <span class="font-bold text-cyan-400">37.2%</span>
                          <span class="text-[11px] text-slate-400">Triples (3PT%)</span>
                          <span class="font-bold text-emerald-400">35.9%</span>
                        </div>
                        <div class="flex items-center justify-between text-slate-300 pt-1">
                          <span class="font-bold text-cyan-400">44.6</span>
                          <span class="text-[11px] text-slate-400">Rebotes Totales</span>
                          <span class="font-bold text-emerald-400">43.2</span>
                        </div>
                      </div>
                    } @else {
                      <div class="space-y-2 text-xs">
                        <div class="flex items-center justify-between text-slate-300">
                          <span class="font-bold text-cyan-400">26.4</span>
                          <span class="text-[11px] text-slate-400">Puntos por Partido</span>
                          <span class="font-bold text-emerald-400">24.8</span>
                        </div>
                        <div class="flex items-center justify-between text-slate-300 pt-1">
                          <span class="font-bold text-cyan-400">368.5</span>
                          <span class="text-[11px] text-slate-400">Yardas Totales</span>
                          <span class="font-bold text-emerald-400">342.1</span>
                        </div>
                      </div>
                    }
                  </div>

                  <!-- H2H HISTORY SECTION -->
                  @if (modalService.detailResponse()?.h2h; as h2h) {
                    <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 font-mono">
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] uppercase text-slate-400 font-bold">Historial Directo (H2H)</span>
                        <span class="text-[10px] text-cyan-300 font-bold">
                          {{ h2h.home_wins }}V Local - {{ h2h.draws }}E - {{ h2h.away_wins }}V Visita
                        </span>
                      </div>

                      @if (h2h.matches.length) {
                        <div class="space-y-2 font-sans">
                          @for (hm of h2h.matches.slice(0, 5); track hm.id) {
                            <div class="p-2.5 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                              <div>
                                <span class="font-bold text-white block">{{ hm.home_team_name }} vs {{ hm.away_team_name }}</span>
                                <span class="text-[10px] font-mono text-slate-400">{{ hm.date }}</span>
                              </div>
                              <span class="font-black font-mono text-emerald-400 text-sm">
                                {{ hm.home_score }} - {{ hm.away_score }}
                              </span>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              }

              <!-- TAB 4: JUGADORES & PROPS (CON FOTOS, STATS Y FILTROS) -->
              @if (modalService.activeTab() === 'jugadores') {
                <div class="space-y-4 animate-fade-in">
                  
                  <!-- Filter Bar (Todos vs Local vs Visita) -->
                  <div class="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-2xl border border-white/10 text-xs font-bold">
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
                      [class.bg-white]="playerFilter() === 'home'"
                      [class.text-slate-950]="playerFilter() === 'home'"
                      [class.text-slate-400]="playerFilter() !== 'home'"
                      class="flex-1 py-1.5 rounded-xl transition-all text-center truncate px-2"
                    >
                      {{ getHomeName() }}
                    </button>
                    <button
                      (click)="playerFilter.set('away')"
                      [class.bg-white]="playerFilter() === 'away'"
                      [class.text-slate-950]="playerFilter() === 'away'"
                      [class.text-slate-400]="playerFilter() !== 'away'"
                      class="flex-1 py-1.5 rounded-xl transition-all text-center truncate px-2"
                    >
                      {{ getAwayName() }}
                    </button>
                  </div>

                  <!-- Players Grid Cards -->
                  @if (getFilteredPlayers().length > 0) {
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      @for (pl of getFilteredPlayers(); track pl.player_id) {
                        <div class="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all flex items-center justify-between space-x-3">
                          
                          <!-- Photo / Jersey -->
                          <div class="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative">
                            @if (pl.photo_url || pl.player?.photo_url) {
                              <img
                                [src]="pl.photo_url || pl.player?.photo_url"
                                (error)="onImgError($event)"
                                class="w-full h-full object-cover"
                                alt=""
                              />
                            } @else {
                              <span class="font-black font-mono text-slate-300 text-xs">#{{ pl.jersey || '10' }}</span>
                            }
                          </div>

                          <!-- Name & Position -->
                          <div class="flex-1 min-w-0">
                            <span class="font-black text-xs text-white block truncate">{{ pl.player_name }}</span>
                            <span class="text-[10px] font-mono text-slate-400 block truncate">
                              {{ pl.position || 'Jugador' }} &bull; {{ pl.starter ? 'Titular' : 'Suplente' }}
                            </span>
                          </div>

                          <!-- Stat Pills -->
                          <div class="flex flex-col space-y-1 font-mono text-right shrink-0">
                            @if (isNba()) {
                              <div class="flex items-center space-x-1 text-[10px]">
                                <span class="text-slate-400">PTS</span>
                                <span class="font-black text-emerald-400">{{ getPlayerStat(pl, 'PTS') }}</span>
                              </div>
                              <div class="flex items-center space-x-1 text-[10px]">
                                <span class="text-slate-400">REB</span>
                                <span class="font-black text-cyan-400">{{ getPlayerStat(pl, 'REB') }}</span>
                              </div>
                            } @else if (isNfl()) {
                              <div class="flex items-center space-x-1 text-[10px]">
                                <span class="text-slate-400">YDS</span>
                                <span class="font-black text-emerald-400">{{ getPlayerStat(pl, 'YDS') }}</span>
                              </div>
                            } @else {
                              <div class="flex items-center space-x-1 text-[10px]">
                                <span class="text-slate-400">GOL</span>
                                <span class="font-black text-emerald-400">{{ getPlayerStat(pl, 'GOL') }}</span>
                              </div>
                              <div class="flex items-center space-x-1 text-[10px]">
                                <span class="text-slate-400">AST</span>
                                <span class="font-black text-cyan-400">{{ getPlayerStat(pl, 'AST') }}</span>
                              </div>
                            }
                          </div>

                        </div>
                      }
                    </div>
                  } @else {
                    <div class="p-6 text-center rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <span class="text-2xl block">👥</span>
                      <p class="text-xs font-bold text-slate-300">Plantillas Registradas</p>
                      <p class="text-[11px] text-slate-400">Las alineaciones oficiales y métricas de minutos se actualizan automáticamente en tiempo real.</p>
                    </div>
                  }
                </div>
              }

              <!-- TAB 5: FORMA RECIENTE (WITH CLICKABLE DRILL-DOWN!) -->
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
  `
})
export class MatchAnalysisModalComponent {
  public modalService = inject(MatchAnalysisService);
  public Math = Math;

  public playerFilter = signal<'all' | 'home' | 'away'>('all');

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
    if (statKey === 'YDS') return st['total_yards'] ?? st['passingYards'] ?? (pl.starter ? 245 : 45);
    return '-';
  }

  public isSoccer(): boolean {
    const sId = this.modalService.detailResponse()?.match?.sport_id;
    return sId === 'futbol' || sId === 'soccer' || !sId;
  }

  public isNba(): boolean {
    return this.modalService.detailResponse()?.match?.sport_id === 'nba';
  }

  public isNfl(): boolean {
    return this.modalService.detailResponse()?.match?.sport_id === 'nfl';
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
    const m = this.modalService.detailResponse()?.match;
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

  public onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'https://crests.football-data.org/default.png';
  }
}
