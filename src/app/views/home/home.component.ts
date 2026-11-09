import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HomeService } from './services/home.service';
import { MatchAnalysisService } from './modals/match-analysis-modal/services/match-analysis.service';
import { MatchAnalysisModalComponent } from './modals/match-analysis-modal/match-analysis-modal.component';
import { NotificationsModalComponent } from '../../shared/components/notifications-modal/notifications-modal.component';
import { NotificationService } from '../../core/services/notification.service';
import { FeaturedMatchPick, MainMatchCard } from './services/home.models';

@Component({
  selector: 'app-mobile-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatchAnalysisModalComponent, NotificationsModalComponent],
  template: `
    <div class="min-h-screen bg-[#F5F6F8] dark:bg-[#070b14] text-slate-900 dark:text-white pb-28 font-sans select-none transition-colors duration-300">
      
      <!-- Top Brand Header Bar with Safe Notch Padding -->
      <header class="sticky top-0 z-30 bg-[#F5F6F8]/90 dark:bg-[#070b14]/90 backdrop-blur-md px-5 pb-3 flex items-center justify-between safe-area-top border-b border-slate-200/50 dark:border-white/10 transition-colors">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-xl bg-slate-950 dark:bg-white/10 p-1 flex items-center justify-center shadow-md">
            <img src="assets/logo.png" alt="PickLab" class="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
          </div>
          <span class="font-black text-2xl tracking-tighter text-slate-950 dark:text-white font-mono">
            PICK<span class="text-emerald-500">LAB</span>
          </span>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Notification Bell with Counter -->
          <button 
            type="button"
            (click)="notifService.toggleModal()"
            class="relative p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10 active:scale-95 transition-all text-slate-800 dark:text-slate-200"
            aria-label="Notificaciones"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            @if (notifService.unreadCount() > 0) {
              <span class="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black font-mono ring-2 ring-white dark:ring-[#070b14] leading-none animate-pulse">
                {{ notifService.unreadCount() }}
              </span>
            }
          </button>

          <!-- User Avatar -->
          <a routerLink="/settings" class="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center text-slate-950 font-black text-xs">
            LG
          </a>
        </div>
      </header>

      <main class="px-5 space-y-6 pt-3">
        
        <!-- User Greeting & Current Date -->
        <section class="space-y-0.5">
          <h1 class="text-3xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
            {{ dashboard().userGreeting }}
          </h1>
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize">
            {{ dashboard().dateSubtitle }}
          </p>
        </section>

        <!-- TOP METRIC CARDS: Resumen Total de Picks Oficiales EV -->
        <section class="grid grid-cols-3 gap-2.5">
          @for (metric of dashboard().metrics; track metric.label) {
            <div class="p-3.5 rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-1 transition-colors">
              <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase font-mono block leading-tight">{{ metric.label }}</span>
              <span class="text-xl font-black text-slate-950 dark:text-white tracking-tight block">{{ metric.value }}</span>
              @if (metric.sublabel) {
                <span class="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 block truncate">{{ metric.sublabel }}</span>
              }
            </div>
          }
        </section>

        <!-- FEATURED HERO CAROUSEL CARD (Pick Oficial EV / Probable por Stats) -->
        <section class="space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400">
              Partidos Destacados del Día
            </span>
            <!-- Carousel Pagination Dots -->
            <div class="flex items-center space-x-1.5">
              @for (item of dashboard().featuredPicks; track item.id; let idx = $index) {
                <button
                  type="button"
                  (click)="homeService.selectFeatured(idx)"
                  [class.w-5]="homeService.featuredIndex() === idx"
                  [class.bg-emerald-500]="homeService.featuredIndex() === idx"
                  [class.w-1.5]="homeService.featuredIndex() !== idx"
                  [class.bg-slate-300]="homeService.featuredIndex() !== idx"
                  [class.dark:bg-slate-700]="homeService.featuredIndex() !== idx"
                  class="h-1.5 rounded-full transition-all duration-300"
                ></button>
              }
            </div>
          </div>

          <!-- Active Carousel Slide Card with Smooth Fade Animation -->
          @if (currentFeatured(); as item) {
            <div class="rounded-3xl p-5 shadow-2xl relative overflow-hidden transition-all duration-500 animate-fade-in bg-gradient-to-br from-[#0c1524] via-[#070e1b] to-[#041a14] border border-emerald-500/30 text-white">
              
              <!-- Subtle Aurora Glow in Card -->
              <div class="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>

              <!-- Top Row: Badge (Pick Oficial vs Prob por Stats) + Kickoff -->
              <div class="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                @if (item.isOfficial) {
                  <span class="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black font-mono text-[10px] tracking-wide flex items-center space-x-1 shadow-md">
                    <span>★</span>
                    <span>{{ item.typeLabel }}</span>
                  </span>
                } @else {
                  <span class="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-black font-mono text-[10px] tracking-wide flex items-center space-x-1">
                    <span>⚡</span>
                    <span>{{ item.typeLabel }}</span>
                  </span>
                }

                <span class="font-mono text-slate-400 text-[11px]">{{ item.kickoff }}</span>
              </div>

              <!-- Match Teams & Logos -->
              <div class="py-4 flex items-center justify-between">
                <!-- Home Team -->
                <div class="flex items-center space-x-3 flex-1 min-w-0">
                  <div class="w-10 h-10 rounded-2xl bg-white/10 p-1.5 flex items-center justify-center shrink-0 border border-white/15">
                    <img [src]="item.homeLogo" [alt]="item.homeTeam" class="w-full h-full object-contain" />
                  </div>
                  <div class="truncate">
                    <span class="font-black text-sm text-white block truncate">{{ item.homeTeam }}</span>
                    <span class="text-[10px] font-mono text-slate-400 block uppercase">Local</span>
                  </div>
                </div>

                <!-- VS Badge -->
                <div class="px-2 font-mono text-xs font-bold text-slate-500">VS</div>

                <!-- Away Team -->
                <div class="flex items-center justify-end space-x-3 flex-1 min-w-0 text-right">
                  <div class="truncate">
                    <span class="font-black text-sm text-white block truncate">{{ item.awayTeam }}</span>
                    <span class="text-[10px] font-mono text-slate-400 block uppercase">Visita</span>
                  </div>
                  <div class="w-10 h-10 rounded-2xl bg-white/10 p-1.5 flex items-center justify-center shrink-0 border border-white/15">
                    <img [src]="item.awayLogo" [alt]="item.awayTeam" class="w-full h-full object-contain" />
                  </div>
                </div>
              </div>

              <!-- Recommended Pick & Estimated Odds -->
              <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between my-1">
                <div>
                  <span class="text-[10px] font-mono text-slate-400 uppercase font-bold block">Pronóstico Sugerido</span>
                  <span class="text-base font-black text-white block">{{ item.pickTitle }}</span>
                </div>
                <div class="text-right">
                  <span class="text-xs font-mono text-slate-400 block">Cuota Est.</span>
                  <span class="text-lg font-black font-mono text-emerald-400">@{{ item.odds.toFixed(2) }}</span>
                </div>
              </div>

              <!-- Edge & Probability Strip -->
              <div class="flex items-center justify-between text-xs py-2 font-mono">
                <span class="text-emerald-400 font-bold">+{{ item.edgePct }}% Valor Matemático (EV)</span>
                <span class="text-slate-400">{{ item.probPct }}% Probabilidad</span>
              </div>

              <!-- Action Buttons: Ver Análisis & Notificar Resultado -->
              <div class="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  (click)="openAnalysis(item)"
                  class="py-3 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  <span>Ver Análisis</span>
                </button>

                <!-- Notify Button -->
                <button
                  type="button"
                  (click)="toggleNotification(item)"
                  [class.bg-emerald-500/20]="notifService.isSubscribed(item.id)"
                  [class.border-emerald-400]="notifService.isSubscribed(item.id)"
                  [class.text-emerald-300]="notifService.isSubscribed(item.id)"
                  class="py-3 px-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 active:scale-95 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  <span>{{ notifService.isSubscribed(item.id) ? 'Notificando ✓' : 'Avisar Resultado' }}</span>
                </button>
              </div>

            </div>
          }
        </section>

        <!-- MAIN PICKS DEL DÍA LIST -->
        <section class="space-y-3 pt-1">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-black text-slate-950 dark:text-white tracking-tight">
              Main Picks del Día
            </h3>
            <span class="text-xs font-mono font-bold text-slate-400">Total: {{ dashboard().mainPicks.length }}</span>
          </div>

          <div class="space-y-3">
            @for (match of dashboard().mainPicks; track match.id) {
              <div class="p-4 rounded-3xl bg-white dark:bg-[#0c1322] border border-slate-200/80 dark:border-white/10 shadow-[0_2px_14px_rgba(0,0,0,0.03)] space-y-3 transition-colors">
                
                <!-- Match League and Type Badge -->
                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center space-x-1.5">
                    <span class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 font-bold font-mono text-[10px] text-slate-600 dark:text-slate-300">
                      {{ match.sport }} • {{ match.league }}
                    </span>
                  </div>

                  @if (match.type === 'OFFICIAL_EV') {
                    <span class="text-[10px] font-black font-mono text-emerald-600 dark:text-emerald-400 uppercase">
                      Pick Oficial (+EV)
                    </span>
                  } @else {
                    <span class="text-[10px] font-black font-mono text-cyan-600 dark:text-cyan-400 uppercase">
                      Probable por Stats
                    </span>
                  }
                </div>

                <!-- Teams Row with Logos -->
                <div class="flex items-center justify-between py-1">
                  <div class="flex items-center space-x-2.5 flex-1 min-w-0">
                    <img [src]="match.homeLogo" [alt]="match.homeTeam" class="w-6 h-6 object-contain shrink-0" />
                    <span class="font-bold text-sm text-slate-900 dark:text-white truncate">{{ match.homeTeam }}</span>
                  </div>

                  <span class="px-2 font-mono text-xs font-bold text-slate-400">vs</span>

                  <div class="flex items-center justify-end space-x-2.5 flex-1 min-w-0 text-right">
                    <span class="font-bold text-sm text-slate-900 dark:text-white truncate">{{ match.awayTeam }}</span>
                    <img [src]="match.awayLogo" [alt]="match.awayTeam" class="w-6 h-6 object-contain shrink-0" />
                  </div>
                </div>

                <!-- Selection & Odds Pill -->
                <div class="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span class="text-[10px] font-mono text-slate-400 uppercase block">Selección</span>
                    <span class="font-black text-slate-900 dark:text-white">{{ match.selection }}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] font-mono text-slate-400 uppercase block">Cuota</span>
                    <span class="font-black font-mono text-emerald-600 dark:text-emerald-400 text-sm">@{{ match.odds.toFixed(2) }}</span>
                  </div>
                </div>

                <!-- Probability Bar & Action Buttons -->
                <div class="space-y-1.5 pt-1">
                  <div class="flex items-center justify-between text-[11px] font-mono">
                    <span class="text-slate-500 dark:text-slate-400">Probabilidad Estimada</span>
                    <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ match.probPct }}%</span>
                  </div>
                  <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                    <div [style.width.%]="match.probPct" class="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
                  </div>
                </div>

                <!-- Card Actions: Ver Análisis & Notificar -->
                <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-white/5">
                  <button
                    type="button"
                    (click)="openMainAnalysis(match)"
                    class="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 active:scale-95 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <span>Ver Análisis</span>
                    <span>&rarr;</span>
                  </button>

                  <button
                    type="button"
                    (click)="toggleMainNotification(match)"
                    [class.bg-emerald-500/15]="notifService.isSubscribed(match.id)"
                    [class.text-emerald-600]="notifService.isSubscribed(match.id)"
                    [class.dark:text-emerald-400]="notifService.isSubscribed(match.id)"
                    class="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/10 active:scale-95 font-semibold text-xs text-slate-700 dark:text-slate-300 flex items-center justify-center space-x-1 transition-all"
                  >
                    <span>🔔</span>
                    <span>{{ notifService.isSubscribed(match.id) ? 'Avisando' : 'Notificar' }}</span>
                  </button>
                </div>

              </div>
            }
          </div>
        </section>

      </main>

      <!-- Analysis Modal & Notifications Drawer -->
      <app-match-analysis-modal />
      <app-notifications-modal />

    </div>
  `
})
export class HomeComponent {
  public homeService = inject(HomeService);
  public modalService = inject(MatchAnalysisService);
  public notifService = inject(NotificationService);

  public dashboard = this.homeService.getDashboardData;
  public currentFeatured = this.homeService.getCurrentFeaturedPick;

  public openAnalysis(item: FeaturedMatchPick): void {
    this.modalService.openAnalysis({
      matchId: item.id,
      matchTitle: `${item.homeTeam} vs ${item.awayTeam}`,
      league: item.league,
      kickoff: item.kickoff,
      market: item.pickTitle,
      targetLine: 2.5,
      marketOdds: item.odds,
      fairOdds: Number((1 / (item.probPct / 100)).toFixed(2)),
      overProbPct: item.probPct,
      underProbPct: Math.round(100 - item.probPct),
      edgePct: item.edgePct,
      isOfficialPick: item.isOfficial,
      isSuspicious: false,
      muML: item.mu,
      sigmaML: item.sigma,
      distributionType: item.sport === 'futbol' ? 'Poisson' : 'Normal',
      iterations: item.simulations,
      percentiles: {
        p10: 1.2,
        p25: 2.0,
        p50: 3.0,
        p75: 4.1,
        p90: 5.2
      },
      reasoning: [
        item.analysisSnippet,
        `Volatilidad proyectada (sigma = ${item.sigma}) se encuentra dentro del rango de alta confiabilidad estadística.`,
        'Margen de cuota desfasada respecto a casas de apuestas de referencia.'
      ]
    });
  }

  public openMainAnalysis(match: MainMatchCard): void {
    this.modalService.openAnalysis({
      matchId: match.id,
      matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
      league: match.league,
      kickoff: match.kickoff,
      market: match.selection,
      targetLine: 2.5,
      marketOdds: match.odds,
      fairOdds: Number((1 / (match.probPct / 100)).toFixed(2)),
      overProbPct: match.probPct,
      underProbPct: Math.round(100 - match.probPct),
      edgePct: match.edgePct,
      isOfficialPick: match.type === 'OFFICIAL_EV',
      isSuspicious: false,
      muML: 2.45,
      sigmaML: 1.05,
      distributionType: 'Normal',
      iterations: 100000,
      percentiles: {
        p10: 1.0,
        p25: 2.0,
        p50: 2.5,
        p75: 3.5,
        p90: 4.5
      },
      reasoning: [
        match.analysisSnippet,
        `Probabilidad de acierto del modelo cuantitativo: ${match.probPct}%.`
      ]
    });
  }

  public toggleNotification(item: FeaturedMatchPick): void {
    this.notifService.toggleSubscription(
      item.id,
      `${item.homeTeam} vs ${item.awayTeam}`,
      item.pickTitle,
      item.odds
    );
  }

  public toggleMainNotification(match: MainMatchCard): void {
    this.notifService.toggleSubscription(
      match.id,
      `${match.homeTeam} vs ${match.awayTeam}`,
      match.selection,
      match.odds
    );
  }
}
