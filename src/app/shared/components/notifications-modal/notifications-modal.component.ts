import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notifications-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (notifService.isOpen()) {
      <div class="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in" (click)="notifService.isOpen.set(false)">
        
        <div 
          class="w-full max-h-[80vh] rounded-t-3xl bg-white dark:bg-[#0c1322] border-t border-slate-200 dark:border-white/10 p-5 shadow-2xl flex flex-col space-y-4 animate-slide-up"
          (click)="$event.stopPropagation()"
          style="padding-bottom: max(env(safe-area-inset-bottom), 24px);"
        >
          <!-- Drag Handle -->
          <div class="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto"></div>

          <!-- Header -->
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
            <div class="flex items-center space-x-2">
              <div class="w-7 h-7 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <h3 class="font-black text-base text-slate-900 dark:text-white">Alertas de Picks Activos</h3>
            </div>

            @if (notifService.notifications().length > 0) {
              <button 
                (click)="notifService.clearAll()" 
                class="text-xs font-semibold text-rose-500 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10"
              >
                Limpiar todo
              </button>
            }
          </div>

          <!-- Notifications List -->
          <div class="overflow-y-auto space-y-3 max-h-[55vh] pr-1">
            @for (item of notifService.notifications(); track item.id) {
              <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1.5 transition-all">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-slate-900 dark:text-white truncate">{{ item.matchTitle }}</span>
                  @if (item.status === 'won') {
                    <span class="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[10px]">
                      ACERTADO
                    </span>
                  } @else if (item.status === 'lost') {
                    <span class="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold font-mono text-[10px]">
                      FALLADO
                    </span>
                  } @else {
                    <span class="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold font-mono text-[10px] flex items-center space-x-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                      <span>EN CURSO</span>
                    </span>
                  }
                </div>

                <div class="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                  <span class="text-slate-900 dark:text-white font-semibold">Pick: {{ item.pickTitle }}</span>
                  @if (item.odds) {
                    <span class="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">@{{ item.odds.toFixed(2) }}</span>
                  }
                </div>

                <p class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {{ item.resultMessage }}
                </p>
              </div>
            } @empty {
              <div class="py-10 text-center space-y-2">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 mx-auto flex items-center justify-center text-slate-400">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                </div>
                <p class="text-sm font-bold text-slate-700 dark:text-slate-300">No tienes alertas activas</p>
                <p class="text-xs text-slate-400 max-w-xs mx-auto">
                  Toca la campanita en cualquier tarjeta de partido para recibir aviso inmediato del resultado.
                </p>
              </div>
            }
          </div>

        </div>

      </div>
    }
  `
})
export class NotificationsModalComponent {
  public notifService = inject(NotificationService);
}
