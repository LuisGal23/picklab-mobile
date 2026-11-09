import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HomeService } from './services/home.service';
import { MatchAnalysisService } from './modals/match-analysis-modal/services/match-analysis.service';
import { MatchAnalysisModalComponent } from './modals/match-analysis-modal/match-analysis-modal.component';
import { MainMatchCard } from './services/home.models';

@Component({
  selector: 'app-mobile-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatchAnalysisModalComponent],
  template: `
    <div class="min-h-screen bg-[#F5F6F8] text-slate-900 pb-24 font-sans select-none">
      
      <!-- Top Brand Header Bar with Edge-To-Edge Notch Padding -->
      <header class="sticky top-0 z-30 bg-[#F5F6F8]/95 backdrop-blur-md px-5 pb-3 flex items-center justify-between safe-area-top border-b border-slate-200/50">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-xl bg-slate-950 p-1 flex items-center justify-center shadow-md">
            <img src="assets/logo.png" alt="PickLab" class="w-full h-full object-contain rounded-lg" />
          </div>
          <span class="font-black text-2xl tracking-tighter text-slate-950 font-mono">PICK<span class="text-emerald-500">LAB</span></span>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Notification Bell -->
          <button class="relative p-2 rounded-full hover:bg-slate-200/60 transition-colors">
            <svg class="w-5 h-5 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </button>

          <!-- User Avatar -->
          <a routerLink="/login" class="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 border-2 border-white shadow-sm flex items-center justify-center text-slate-950 font-black text-xs">
            LG
          </a>
        </div>
      </header>

      <main class="px-5 space-y-6 pt-2">
        
        <!-- Greeting Header -->
        <section class="space-y-1">
          <h1 class="text-3xl font-black tracking-tight text-slate-950 leading-tight">
            {{ dashboard().userGreeting }}
          </h1>
          <p class="text-xs font-medium text-slate-500">
            {{ dashboard().dateSubtitle }}
          </p>
        </section>

        <!-- KPI Metric Chips (Row of 3 White Cards) -->
        <section class="grid grid-cols-3 gap-3">
          @for (metric of dashboard().metrics; track metric.label) {
            <div class="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-1">
              <span class="text-[11px] font-medium text-slate-400 block">{{ metric.label }}</span>
              <span class="text-xl font-black text-slate-950 tracking-tight block">{{ metric.value }}</span>
            </div>
          }
        </section>

        <!-- Featured Picks Section -->
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-slate-900 font-black text-base flex items-center space-x-1.5">
                <svg class="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <span>Featured Picks (5)</span>
              </span>
            </div>
            <span class="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold tracking-tight">
              Top Picks
            </span>
          </div>

          <!-- Featured Pick Hero Card (Dark Emerald/Forest Theme) -->
          <div class="rounded-3xl bg-gradient-to-br from-[#072d24] via-[#0b382d] to-[#041d17] text-white p-6 shadow-xl relative overflow-hidden space-y-5">
            <!-- Background Glow and Pattern -->
            <div class="absolute -right-10 -bottom-10 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <div class="space-y-3 relative z-10">
              <!-- League Badge -->
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-white flex items-center space-x-1.5">
                  <span class="w-2 h-2 rounded-full bg-red-500"></span>
                  <span>{{ dashboard().featuredPick.league }}</span>
                </span>
                <span class="text-xs font-mono text-emerald-300 font-bold">
                  {{ dashboard().featuredPick.kickoff }}
                </span>
              </div>

              <!-- Match Teams -->
              <div>
                <span class="text-xs text-slate-300 block font-medium">Partido del Día</span>
                <h2 class="text-2xl font-black tracking-tight text-white leading-snug">
                  {{ dashboard().featuredPick.homeTeam }} <span class="text-emerald-400 font-normal">vs</span> {{ dashboard().featuredPick.awayTeam }}
                </h2>
              </div>

              <!-- Pick Market Display -->
              <div class="pt-1">
                <div class="text-2xl font-black tracking-tight text-white flex items-center space-x-2">
                  <span>Over</span>
                  <span class="text-[#22c55e] font-mono text-3xl font-black">2.5</span>
                  <span>Goles</span>
                </div>
              </div>

              <!-- Bottom Bar with Odds and Neon Analysis Button -->
              <div class="pt-2 flex items-center justify-between">
                <div class="px-3.5 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-300">
                  odds <strong class="text-white text-sm font-black">{{ dashboard().featuredPick.odds.toFixed(2) }}</strong>
                </div>

                <button
                  (click)="openFeaturedAnalysis()"
                  class="px-5 py-2 rounded-full bg-[#22c55e] hover:bg-[#1eb354] active:scale-95 text-slate-950 font-black text-xs transition-all shadow-md flex items-center space-x-1 cursor-pointer"
                >
                  <span>Analysis</span>
                  <span>&gt;</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Carousel Dots -->
          <div class="flex items-center justify-center space-x-1.5 pt-1">
            <span class="w-4 h-1.5 rounded-full bg-emerald-600 transition-all"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          </div>
        </section>

        <!-- Main Picks Section -->
        <section class="space-y-3.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-1.5">
              <svg class="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              <h3 class="text-slate-950 font-black text-base">Main Picks</h3>
            </div>
            <a routerLink="/picks" class="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center space-x-1">
              <span>View All</span>
              <span>&gt;</span>
            </a>
          </div>

          <!-- Match Cards (White Minimalist Cards as in Screenshot) -->
          <div class="space-y-3">
            @for (match of dashboard().mainPicks; track match.id) {
              <div
                (click)="openMatchCardAnalysis(match)"
                class="p-4 rounded-3xl bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3.5 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <!-- Card Header: Acronym / League + Confidence Pill -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div class="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center font-black text-xs text-slate-700">
                      {{ match.league.slice(0, 3).toUpperCase() }}
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-400 font-mono uppercase block font-semibold">{{ match.league }}</span>
                      <span class="text-xs font-bold text-slate-700">{{ match.kickoff }}</span>
                    </div>
                  </div>

                  <!-- Green Probability Pill -->
                  <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center space-x-1 font-mono">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{{ match.probPct }}%</span>
                  </span>
                </div>

                <!-- Match Teams Clash -->
                <div class="text-sm font-black text-slate-900">
                  {{ match.homeTeam }} <span class="text-slate-400 font-normal">vs</span> {{ match.awayTeam }}
                </div>

                <!-- Bottom Row: Pick Pill & Odds -->
                <div class="flex items-center justify-between pt-1">
                  <span class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs font-mono tracking-tight">
                    {{ match.pickType }}
                  </span>

                  <span class="text-xs font-mono text-slate-500 font-medium">
                    odds <strong class="text-slate-950 text-sm font-black">{{ match.odds.toFixed(2) }}</strong>
                  </span>
                </div>
              </div>
            }
          </div>
        </section>

      </main>

      <!-- Match Analysis Modal -->
      <app-match-analysis-modal />

    </div>
  `
})
export class HomeComponent {
  private homeService = inject(HomeService);
  private analysisService = inject(MatchAnalysisService);

  public dashboard = this.homeService.getDashboard();

  public openFeaturedAnalysis() {
    const f = this.dashboard().featuredPick;
    this.analysisService.openAnalysis({
      matchId: f.id,
      matchTitle: f.homeTeam + ' vs ' + f.awayTeam,
      league: f.league,
      kickoff: f.kickoff,
      market: f.pickTitle,
      marketOdds: f.odds,
      fairOdds: 1.60,
      overProbPct: f.probPct,
      edgePct: f.edgePct,
      muML: f.mu,
      sigmaML: f.sigma,
      iterations: f.simulations
    });
  }

  public openMatchCardAnalysis(match: MainMatchCard) {
    this.analysisService.openAnalysis({
      matchId: match.id,
      matchTitle: match.homeTeam + ' vs ' + match.awayTeam,
      league: match.league,
      kickoff: match.kickoff,
      market: match.pickType,
      marketOdds: match.odds,
      fairOdds: Number((match.odds / (1 + match.edgePct / 100)).toFixed(2)),
      overProbPct: match.probPct,
      edgePct: match.edgePct,
      muML: 2.85,
      sigmaML: 1.10
    });
  }
}
