import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService } from '../../core/services/settings.service';
import { ThemeService } from '../../core/services/theme.service';
import { LoginService } from '../auth/login/services/login.service';

@Component({
  selector: 'app-mobile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] dark:bg-[#090D14] text-slate-900 dark:text-white pb-28 font-sans select-none transition-colors duration-300">
      
      <!-- Top Bar with Safe Area Top -->
      <header class="sticky top-0 z-30 bg-[#F8FAFC]/90 dark:bg-[#090D14]/90 backdrop-blur-md px-5 pt-4 pb-3 border-b border-slate-200/80 dark:border-white/10 safe-area-top">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[11px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 block tracking-wider">
              Preferencias del Sistema
            </span>
            <h1 class="text-2xl font-black text-slate-950 dark:text-white tracking-tight">Ajustes</h1>
          </div>
          <div class="w-9 h-9 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 font-bold text-sm">
            ⚙️
          </div>
        </div>
      </header>

      <main class="px-5 space-y-5 pt-4">

        <!-- 1. PERFIL DE USUARIO -->
        <section class="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div class="flex items-center space-x-3.5">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
              {{ userInitial() }}
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Cuenta Activa</span>
              <h2 class="text-lg font-black text-slate-900 dark:text-white truncate">
                {{ currentSession()?.user?.name || 'Usuario PickLab' }}
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
                {{ currentSession()?.user?.email || 'usuario@picklab.io' }}
              </p>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Cambiar Nombre de Usuario
            </label>
            <div class="flex items-center space-x-2">
              <input
                type="text"
                [(ngModel)]="editName"
                placeholder="Tu nombre o alias..."
                class="flex-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors font-medium"
              />
              <button
                (click)="saveName()"
                class="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs transition-all shadow-md shrink-0"
              >
                Guardar
              </button>
            </div>
            @if (nameSavedSuccess()) {
              <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold animate-fade-in">
                ✓ Nombre actualizado correctamente
              </p>
            }
          </div>
        </section>

        <!-- 2. AJUSTE DE NOTCH Y CÁMARA (GOTA DE AGUA) -->
        <section class="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3.5">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="flex items-center space-x-2">
                <span class="text-base">📱</span>
                <h3 class="text-sm font-black text-slate-900 dark:text-white">Ajuste de Notch / Gota de Agua</h3>
              </div>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">
                Adapta el margen superior para que la cámara frontal no tape texto o botones
              </p>
            </div>
            <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20">
              {{ settings.notchOffset() }}px
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-1">
            @for (opt of settings.notchOptions; track opt.id) {
              <button
                (click)="settings.setNotchOffset(opt.value)"
                [class.border-emerald-500]="settings.notchOffset() === opt.value"
                [class.bg-emerald-50/70]="settings.notchOffset() === opt.value"
                [class.dark:bg-emerald-950/40]="settings.notchOffset() === opt.value"
                [class.text-emerald-900]="settings.notchOffset() === opt.value"
                [class.dark:text-emerald-300]="settings.notchOffset() === opt.value"
                [class.border-slate-200]="settings.notchOffset() !== opt.value"
                [class.dark:border-white/5]="settings.notchOffset() !== opt.value"
                [class.bg-slate-50]="settings.notchOffset() !== opt.value"
                [class.dark:bg-slate-800/40]="settings.notchOffset() !== opt.value"
                [class.text-slate-700]="settings.notchOffset() !== opt.value"
                [class.dark:text-slate-300]="settings.notchOffset() !== opt.value"
                class="p-3 rounded-2xl border text-left transition-all relative overflow-hidden"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-black">{{ opt.label }}</span>
                  <span class="text-[10px] font-mono opacity-70">{{ opt.value }}px</span>
                </div>
                <p class="text-[10px] opacity-75 leading-tight">{{ opt.description }}</p>
              </button>
            }
          </div>
        </section>

        <!-- 3. TEMA OSCURO / CLARO -->
        <section class="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center space-x-2">
              <span class="text-base">{{ theme.isDark() ? '🌙' : '☀️' }}</span>
              <h3 class="text-sm font-black text-slate-900 dark:text-white">Tema de la App</h3>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              {{ theme.isDark() ? 'Modo Oscuro activado (ahorro de batería OLED)' : 'Modo Claro activado' }}
            </p>
          </div>

          <button
            (click)="theme.toggleTheme()"
            class="px-4 py-2 rounded-2xl font-bold text-xs flex items-center space-x-2 transition-all border shadow-sm"
            [class.bg-slate-900]="!theme.isDark()"
            [class.text-white]="!theme.isDark()"
            [class.border-slate-800]="!theme.isDark()"
            [class.bg-white]="theme.isDark()"
            [class.text-slate-900]="theme.isDark()"
            [class.border-white/20]="theme.isDark()"
          >
            <span>{{ theme.isDark() ? 'Cambiar a Claro' : 'Cambiar a Oscuro' }}</span>
          </button>
        </section>

        <!-- 4. IDIOMA -->
        <section class="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
          <div class="flex items-center space-x-2">
            <span class="text-base">🌐</span>
            <h3 class="text-sm font-black text-slate-900 dark:text-white">Idioma de la Interfaz</h3>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button
              (click)="settings.setLanguage('es')"
              [class.bg-emerald-500]="settings.language() === 'es'"
              [class.text-slate-950]="settings.language() === 'es'"
              [class.font-black]="settings.language() === 'es'"
              [class.bg-slate-100]="settings.language() !== 'es'"
              [class.dark:bg-slate-800/60]="settings.language() !== 'es'"
              [class.text-slate-700]="settings.language() !== 'es'"
              [class.dark:text-slate-300]="settings.language() !== 'es'"
              class="py-2.5 px-3 rounded-2xl text-xs font-bold transition-all text-center border border-transparent shadow-sm flex items-center justify-center space-x-2"
            >
              <span>🇲🇽</span>
              <span>Español</span>
            </button>

            <button
              (click)="settings.setLanguage('en')"
              [class.bg-emerald-500]="settings.language() === 'en'"
              [class.text-slate-950]="settings.language() === 'en'"
              [class.font-black]="settings.language() === 'en'"
              [class.bg-slate-100]="settings.language() !== 'en'"
              [class.dark:bg-slate-800/60]="settings.language() !== 'en'"
              [class.text-slate-700]="settings.language() !== 'en'"
              [class.dark:text-slate-300]="settings.language() !== 'en'"
              class="py-2.5 px-3 rounded-2xl text-xs font-bold transition-all text-center border border-transparent shadow-sm flex items-center justify-center space-x-2"
            >
              <span>🇺🇸</span>
              <span>English</span>
            </button>
          </div>
        </section>

        <!-- 5. INFORMACIÓN DEL SISTEMA & APK -->
        <section class="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 space-y-2 text-xs">
          <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Versión de la App</span>
            <span class="font-mono font-bold text-slate-800 dark:text-slate-200">PickLab 1.0.0 (Native Cutout)</span>
          </div>
          <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Simulador Monte Carlo</span>
            <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">100,000 iteraciones</span>
          </div>
          <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Auditoría DB</span>
            <span class="font-mono font-bold text-cyan-600 dark:text-cyan-400">SHA-256 Verificado</span>
          </div>
        </section>

        <!-- 6. CERRAR SESIÓN -->
        <div class="pt-2">
          <button
            (click)="logout()"
            class="w-full py-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-98 text-rose-600 dark:text-rose-400 font-black text-xs border border-rose-500/30 transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </main>

    </div>
  `
})
export class SettingsComponent {
  public settings = inject(SettingsService);
  public theme = inject(ThemeService);
  public login = inject(LoginService);
  private router = inject(Router);

  public currentSession = this.login.currentSession;
  public editName = '';
  public nameSavedSuccess = signal(false);

  public userInitial = computed(() => {
    const name = this.currentSession()?.user?.name || 'U';
    return name.charAt(0).toUpperCase();
  });

  constructor() {
    const curName = this.currentSession()?.user?.name;
    if (curName) {
      this.editName = curName;
    }
  }

  public saveName(): void {
    if (this.editName.trim()) {
      this.login.updateUserName(this.editName.trim());
      this.nameSavedSuccess.set(true);
      setTimeout(() => this.nameSavedSuccess.set(false), 3000);
    }
  }

  public logout(): void {
    this.login.logout();
    this.router.navigate(['/login']);
  }
}
