import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { LoginCredentials, RegisterData } from './services/login.models';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#070b14] flex flex-col justify-between font-sans select-none overflow-x-hidden animate-fade-in">
      
      <!-- TOP HALF: Branded Dark Gradient with Notch Support & Glowing Logo -->
      <div 
        class="w-full pt-8 pb-10 px-6 flex flex-col justify-between relative overflow-hidden"
        style="padding-top: max(env(safe-area-inset-top), 24px);"
      >
        <!-- Background Ambient Aurora Waves -->
        <div class="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>
        <div class="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"></div>

        <!-- Header Controls: Logo Monogram & Theme Toggle Button -->
        <div class="flex items-center justify-between relative z-10 pb-4">
          <div class="flex items-center space-x-2.5">
            <div class="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-1.5 flex items-center justify-center shadow-lg">
              <img src="assets/logo.png" alt="PickLab" class="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </div>
            <span class="font-black text-xl tracking-tighter text-white font-mono">
              PICK<span class="text-emerald-400">LAB</span>
            </span>
          </div>

          <!-- THEME TOGGLE BUTTON -->
          <button
            type="button"
            (click)="themeService.toggleTheme()"
            class="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center space-x-1.5 backdrop-blur-md transition-all active:scale-95 shadow-sm"
            [title]="themeService.isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          >
            @if (themeService.isDark()) {
              <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
              <span>Claro</span>
            } @else {
              <svg class="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
              <span>Oscuro</span>
            }
          </button>
        </div>

        <!-- Hero Brand Typography in Top Half -->
        <div class="space-y-1.5 relative z-10 pt-2">
          <div class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-bold tracking-wider uppercase">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Acceso Exclusivo • Motor Monte Carlo</span>
          </div>
          <h2 class="text-3xl font-black text-white tracking-tight leading-tight">
            Pronósticos de valor con rigor matemático.
          </h2>
          <p class="text-xs text-slate-300 font-medium">
            Ingresa a tu cuenta para auditar cuotas y picks en tiempo real.
          </p>
        </div>

      </div>

      <!-- BOTTOM HALF: Adaptive Theme Card Container (White in Light, Deep Navy in Dark) -->
      <div 
        class="w-full flex-1 rounded-t-[36px] bg-[#F5F6F8] dark:bg-[#0c1322] text-slate-900 dark:text-white px-6 pt-6 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.35)] flex flex-col justify-between transition-colors duration-300"
        style="padding-bottom: max(env(safe-area-inset-bottom), 24px);"
      >
        
        <!-- Segmented Tab Pill: [Iniciar Sesión] | [Crear Cuenta] -->
        <div class="w-full p-1 rounded-2xl bg-slate-200 dark:bg-white/10 flex items-center mb-5">
          <button
            type="button"
            (click)="activeTab = 'login'"
            [class.bg-white]="activeTab === 'login'"
            [class.dark:bg-[#152033]]="activeTab === 'login'"
            [class.text-slate-950]="activeTab === 'login'"
            [class.dark:text-white]="activeTab === 'login'"
            [class.shadow-md]="activeTab === 'login'"
            [class.text-slate-500]="activeTab !== 'login'"
            [class.dark:text-slate-400]="activeTab !== 'login'"
            class="flex-1 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all text-center"
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            (click)="activeTab = 'register'"
            [class.bg-white]="activeTab === 'register'"
            [class.dark:bg-[#152033]]="activeTab === 'register'"
            [class.text-slate-950]="activeTab === 'register'"
            [class.dark:text-white]="activeTab === 'register'"
            [class.shadow-md]="activeTab === 'register'"
            [class.text-slate-500]="activeTab !== 'register'"
            [class.dark:text-slate-400]="activeTab !== 'register'"
            class="flex-1 py-2.5 rounded-xl text-xs font-black tracking-wide transition-all text-center"
          >
            Crear Cuenta
          </button>
        </div>

        <!-- TAB 1: FORMULARIO INICIAR SESIÓN -->
        @if (activeTab === 'login') {
          <form (ngSubmit)="onLogin()" class="space-y-4 animate-fade-in my-auto">
            
            <!-- Email -->
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Correo Electrónico
              </label>
              <div class="relative flex items-center">
                <span class="absolute left-4 text-slate-400">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  [(ngModel)]="loginCreds.email"
                  placeholder="ejemplo@picklab.io"
                  class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                  Contraseña
                </label>
                <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">¿Olvidaste tu contraseña?</span>
              </div>
              <div class="relative flex items-center">
                <span class="absolute left-4 text-slate-400">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  [(ngModel)]="loginCreds.password"
                  placeholder="••••••••"
                  class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
                />
              </div>
            </div>

            <!-- Remember me -->
            <div class="flex items-center justify-between pt-1">
              <label class="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  [(ngModel)]="loginCreds.rememberMe"
                  class="rounded text-emerald-500 border-slate-300 dark:border-white/20 focus:ring-emerald-500"
                />
                <span>Recordar sesión</span>
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loginService.isLoading()"
              class="w-full py-4 rounded-2xl bg-slate-950 dark:bg-emerald-500 hover:bg-slate-900 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-black text-sm tracking-wide shadow-xl active:scale-[0.98] flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-2"
            >
              @if (loginService.isLoading()) {
                <span class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                <span>Iniciando sesión...</span>
              } @else {
                <span>Ingresar a PickLab</span>
                <span>&rarr;</span>
              }
            </button>
          </form>
        }

        <!-- TAB 2: FORMULARIO CREAR CUENTA -->
        @if (activeTab === 'register') {
          <form (ngSubmit)="onRegister()" class="space-y-3.5 animate-fade-in my-auto">
            
            <!-- Full Name -->
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Nombre y Apellido
              </label>
              <input
                type="text"
                name="fullName"
                required
                [(ngModel)]="registerData.fullName"
                placeholder="Luis Gallardo"
                class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
              />
            </div>

            <!-- Email -->
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="regEmail"
                required
                [(ngModel)]="registerData.email"
                placeholder="tu@correo.com"
                class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
              />
            </div>

            <!-- Password -->
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Contraseña
              </label>
              <input
                type="password"
                name="regPassword"
                required
                [(ngModel)]="registerData.password"
                placeholder="Mínimo 6 caracteres"
                class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
              />
            </div>

            <!-- Confirm Password -->
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="regConfirmPassword"
                required
                [(ngModel)]="registerData.confirmPassword"
                placeholder="Repite tu contraseña"
                class="w-full px-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
              />
            </div>

            <!-- Register Button -->
            <button
              type="submit"
              [disabled]="loginService.isLoading()"
              class="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-95 text-slate-950 font-black text-sm tracking-wide shadow-xl active:scale-[0.98] flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-1"
            >
              @if (loginService.isLoading()) {
                <span class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Creando cuenta...</span>
              } @else {
                <span>Crear Cuenta y Comenzar</span>
                <span>&rarr;</span>
              }
            </button>
          </form>
        }

        <!-- Bottom Security Disclaimer -->
        <div class="pt-4 text-center">
          <p class="text-[11px] text-slate-400 font-mono">
            🔒 Inmutable SHA-256 • Auditoría Cuantitativa de Picks
          </p>
        </div>

      </div>

    </div>
  `
})
export class LoginComponent {
  public loginService = inject(LoginService);
  public themeService = inject(ThemeService);
  private router = inject(Router);

  public activeTab: 'login' | 'register' = 'login';

  public loginCreds: LoginCredentials = {
    email: '',
    password: '',
    rememberMe: true
  };

  public registerData: RegisterData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  public async onLogin(): Promise<void> {
    await this.loginService.login(this.loginCreds);
    this.router.navigate(['/home']);
  }

  public async onRegister(): Promise<void> {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }
    await this.loginService.register(this.registerData);
    this.router.navigate(['/home']);
  }
}
