import { Component, OnInit, OnDestroy, inject, signal, input, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService, PlayerProfileResponse } from '../../core/services/api.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-player-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] dark:bg-[#060a12] text-slate-900 dark:text-white pb-28 select-none transition-colors duration-300 font-sans">
      
      <!-- Top Sticky Navigation Bar -->
      <header class="sticky top-0 z-30 bg-[#F8FAFC]/95 dark:bg-[#060a12]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-slate-200/80 dark:border-white/10 safe-area-top flex items-center justify-between">
        <button
          type="button"
          (click)="goBack()"
          class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 text-slate-800 dark:text-slate-200 text-xs font-bold active:scale-95 transition-all"
        >
          <span>&larr;</span>
          <span>Volver</span>
        </button>

        <div class="flex items-center space-x-2">
          <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
            {{ sportBadge() }}
          </span>
          <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            Auditado
          </span>
        </div>
      </header>

      <main class="px-4 py-4 space-y-5 animate-fade-in">
        @if (loading()) {
          <div class="flex flex-col items-center justify-center py-28 space-y-4 text-slate-400">
            <div class="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-xs font-mono font-bold">Cargando analítica y ficha del jugador...</span>
          </div>
        } @else if (!profile()) {
          <div class="text-center py-20 bg-white dark:bg-[#0b1220] border border-slate-200 dark:border-white/10 rounded-3xl p-6 space-y-3">
            <span class="text-4xl block">👤</span>
            <h3 class="text-base font-black text-slate-900 dark:text-white">Jugador no encontrado</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">No se pudieron recuperar las estadísticas de este atleta.</p>
            <button
              (click)="goBack()"
              class="mt-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Regresar
            </button>
          </div>
        } @else {
          <!-- HERO TRADING CARD HEADER -->
          <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1c2e] via-[#091220] to-[#040913] border border-cyan-500/30 p-5 shadow-2xl text-white">
            <!-- Ambient Glow -->
            <div class="absolute -right-16 -top-16 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -left-16 -bottom-16 w-56 h-56 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <div class="relative z-10 flex flex-col items-center text-center space-y-4">
              <!-- Team & Jersey & Position Badges -->
              <div class="flex flex-wrap items-center justify-center gap-2">
                @if (profile()?.team) {
                  <div class="inline-flex items-center space-x-1.5 bg-white/10 border border-white/15 px-3 py-1 rounded-xl text-xs font-bold">
                    @if (profile()?.team?.logo_url) {
                      <img [src]="profile()?.team?.logo_url" [alt]="profile()?.team?.name" class="w-4 h-4 object-contain" />
                    }
                    <span>{{ profile()?.team?.name }}</span>
                  </div>
                }
                @if (profile()?.player?.jersey) {
                  <span class="px-2.5 py-1 rounded-xl font-mono font-black text-xs bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                    #{{ profile()?.player?.jersey }}
                  </span>
                }
                <span class="px-2.5 py-1 rounded-xl text-xs font-bold bg-white/10 border border-white/10 text-slate-300">
                  {{ profile()?.player?.position || 'Atleta' }}
                </span>
              </div>

              <!-- Player Cutout Photo (Floating with drop shadow) -->
              <div class="w-44 h-44 sm:w-52 sm:h-52 relative flex items-center justify-center my-1">
                @if (profile()?.player?.photo_url && !imageFailed()) {
                  <img
                    [src]="profile()?.player?.photo_url"
                    [alt]="profile()?.player?.name"
                    (error)="onImageError()"
                    class="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] pointer-events-none transform transition-transform duration-300 hover:scale-105"
                  />
                } @else {
                  <div class="w-36 h-36 rounded-full bg-slate-900 border-2 border-white/10 flex flex-col items-center justify-center text-slate-400 space-y-1">
                    <span class="text-5xl">👤</span>
                    <span class="text-xs font-mono font-bold">#{{ profile()?.player?.jersey || '0' }}</span>
                  </div>
                }
              </div>

              <!-- Name & Title -->
              <div>
                <h1 class="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  {{ profile()?.player?.name }}
                </h1>
                <p class="text-[11px] text-slate-400 mt-1 font-medium max-w-xs mx-auto">
                  Rendimiento en vivo, histórico por temporada y métricas de simulación en PickLab
                </p>
              </div>

              <!-- 4-KPI Grid (Mobile 2x2) -->
              <div class="grid grid-cols-2 gap-2.5 w-full pt-1">
                <div class="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <span class="text-[9px] text-slate-400 uppercase font-bold block">{{ profile()?.summary?.primary_label }}</span>
                  <span class="text-xl font-black text-emerald-400 font-mono">{{ profile()?.summary?.primary_val }}</span>
                </div>
                <div class="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <span class="text-[9px] text-slate-400 uppercase font-bold block">{{ profile()?.summary?.secondary_label }}</span>
                  <span class="text-xl font-black text-cyan-300 font-mono">{{ profile()?.summary?.secondary_val }}</span>
                </div>
                <div class="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <span class="text-[9px] text-slate-400 uppercase font-bold block">{{ profile()?.summary?.tertiary_label }}</span>
                  <span class="text-xl font-black text-blue-400 font-mono">{{ profile()?.summary?.tertiary_val }}</span>
                </div>
                <div class="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <span class="text-[9px] text-slate-400 uppercase font-bold block">Partidos Jugados</span>
                  <span class="text-xl font-black text-slate-200 font-mono">{{ profile()?.summary?.games_played }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- TREND LINE CHART (Recent Games Performance) -->
          <div class="bg-white dark:bg-[#0b1220] border border-slate-200 dark:border-white/10 rounded-3xl p-4 sm:p-5 space-y-3 shadow-md">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div>
                <h3 class="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-1.5">
                  <span>📈</span>
                  <span>Evolución Reciente</span>
                </h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  {{ profile()?.chart?.primary_label }} en los últimos encuentros
                </p>
              </div>
              @if (profile()?.summary?.top_performance) {
                <span class="text-[10px] font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  Pico: {{ profile()?.summary?.top_performance }}
                </span>
              }
            </div>

            <div class="relative h-56 w-full">
              <canvas #trendCanvas></canvas>
            </div>
          </div>

          <!-- RADAR DE HABILIDADES Y ATRIBUTOS -->
          @if (profile()?.chart?.radar_labels?.length) {
            <div class="bg-white dark:bg-[#0b1220] border border-slate-200 dark:border-white/10 rounded-3xl p-4 sm:p-5 space-y-3 shadow-md">
              <div class="border-b border-slate-100 dark:border-white/10 pb-3">
                <h3 class="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-1.5">
                  <span>🕸️</span>
                  <span>Atributos & Rol</span>
                </h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  Perfil multidimensional frente al promedio de la liga
                </p>
              </div>

              <div class="relative h-60 w-full flex items-center justify-center">
                <canvas #radarCanvas></canvas>
              </div>
            </div>
          }

          <!-- RECENT MATCHES LOG -->
          <div class="bg-white dark:bg-[#0b1220] border border-slate-200 dark:border-white/10 rounded-3xl p-4 sm:p-5 space-y-3 shadow-md">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <div>
                <h3 class="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-1.5">
                  <span>📋</span>
                  <span>Partidos Recientes</span>
                </h3>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">Estadísticas registradas y auditadas</p>
              </div>
              <span class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {{ profile()?.recent_matches?.length || 0 }} partidos
              </span>
            </div>

            <div class="space-y-2">
              @for (m of profile()?.recent_matches || []; track m.match_id) {
                <div class="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                  <div class="space-y-0.5">
                    <span class="font-black text-slate-900 dark:text-white text-xs block font-sans">
                      vs {{ m.opponent }}
                    </span>
                    <span class="text-[10px] text-slate-500 dark:text-slate-400 block">
                      {{ m.date }} &bull; {{ m.minutes }}'
                    </span>
                  </div>

                  <div class="text-right space-y-0.5">
                    <span class="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-800 dark:text-slate-200 inline-block">
                      {{ m.score }}
                    </span>
                    <span class="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                      {{ m.stats_display }}
                    </span>
                  </div>
                </div>
              } @empty {
                <div class="p-6 text-center text-slate-400 text-xs">
                  No hay registros oficiales aún para este atleta.
                </div>
              }
            </div>
          </div>
        }
      </main>
    </div>
  `
})
export class PlayerProfileComponent implements OnInit, OnDestroy {
  public id = input<string>();
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private location = inject(Location);

  public profile = signal<PlayerProfileResponse | null>(null);
  public loading = signal<boolean>(true);
  public imageFailed = signal<boolean>(false);

  @ViewChild('trendCanvas') trendCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('radarCanvas') radarCanvas!: ElementRef<HTMLCanvasElement>;

  private trendChartInstance?: Chart;
  private radarChartInstance?: Chart;

  constructor() {
    effect(() => {
      const p = this.profile();
      if (p && this.trendCanvas) {
        setTimeout(() => this.renderCharts(p), 60);
      }
    });
  }

  ngOnInit() {
    const routeId = this.route.snapshot.paramMap.get('id');
    const playerId = this.id() || routeId;
    if (playerId) {
      this.loadProfile(playerId);
    }
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  public goBack() {
    this.location.back();
  }

  public onImageError() {
    this.imageFailed.set(true);
  }

  public sportBadge(): string {
    const s = this.profile()?.player?.sport_id;
    if (s === 'nba') return 'NBA';
    if (s === 'nfl') return 'NFL';
    if (s === 'mlb') return 'MLB';
    return 'Fútbol';
  }

  private loadProfile(playerId: string) {
    this.loading.set(true);
    this.api.getPlayerProfile(playerId).subscribe({
      next: (res) => {
        this.profile.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private destroyCharts() {
    if (this.trendChartInstance) {
      this.trendChartInstance.destroy();
      this.trendChartInstance = undefined;
    }
    if (this.radarChartInstance) {
      this.radarChartInstance.destroy();
      this.radarChartInstance = undefined;
    }
  }

  private renderCharts(data: PlayerProfileResponse) {
    this.destroyCharts();

    // 1. Trend Line Chart
    if (this.trendCanvas?.nativeElement && data.chart?.labels?.length) {
      const ctx = this.trendCanvas.nativeElement.getContext('2d');
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

        this.trendChartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.chart.labels,
            datasets: [
              {
                label: data.chart.primary_label || 'Rendimiento',
                data: data.chart.primary_values,
                borderColor: '#10b981',
                backgroundColor: gradient,
                borderWidth: 2.5,
                fill: true,
                tension: 0.35,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1.5,
                pointRadius: 4,
                pointHoverRadius: 6
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
                bodyColor: '#10b981',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 12
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 10 } }
              },
              y: {
                grid: { color: 'rgba(255,255,255,0.06)' },
                ticks: { color: '#64748b', font: { size: 10 } }
              }
            }
          }
        });
      }
    }

    // 2. Radar Chart
    if (this.radarCanvas?.nativeElement && data.chart?.radar_labels?.length) {
      const ctx = this.radarCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.radarChartInstance = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: data.chart.radar_labels,
            datasets: [
              {
                label: 'Calificación',
                data: data.chart.radar_values,
                backgroundColor: 'rgba(16, 185, 129, 0.25)',
                borderColor: '#10b981',
                borderWidth: 2,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#0f172a',
                pointRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              r: {
                min: 0,
                max: 100,
                angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
                grid: { color: 'rgba(255, 255, 255, 0.08)' },
                pointLabels: { color: '#cbd5e1', font: { size: 10, weight: 'bold' } },
                ticks: { display: false }
              }
            }
          }
        });
      }
    }
  }
}
