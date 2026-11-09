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
    <div class="min-h-screen bg-[#060911] text-white flex flex-col justify-between font-sans select-none overflow-x-hidden animate-fade-in relative">
      
      <!-- Ambient Aurora Background Glows -->
      <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/20 blur-[100px] pointer-events-none"></div>
      <div class="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-[110px] pointer-events-none"></div>
      <div class="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full bg-teal-500/10 blur-[90px] pointer-events-none"></div>

      <!-- TOP BRAND HEADER (Adaptive with Notch Safe Area) -->
      <div 
        class="w-full pt-6 pb-6 px-6 flex flex-col justify-between relative z-10"
        style="padding-top: max(env(safe-area-inset-top), 28px);"
      >
        <!-- Top bar with PickLab Emblem and Theme Toggle -->
        <div class="flex items-center justify-between pb-6">
          <div class="flex items-center space-x-3">
            <div class="w-11 h-11 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-2 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <img src="assets/logo.png" alt="PickLab" class="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
            </div>
            <div>
              <span class="font-black text-2xl tracking-tighter text-white font-mono block leading-none">
                PICK<span class="text-emerald-400">LAB</span>
              </span>
              <span class="text-[9px] font-mono tracking-widest text-emerald-400/80 uppercase">Quantitative ML</span>
            </div>
          </div>

          <!-- Quick Theme Switcher Pill -->
          <button
            type="button"
            (click)="themeService.toggleTheme()"
            class="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center space-x-2 backdrop-blur-xl transition-all active:scale-95 shadow-sm"
          >
            @if (themeService.isDark()) {
              <span class="text-amber-400 text-xs">🌙</span>
              <span>Oscuro</span>
            } @else {
              <span class="text-cyan-300 text-xs">☀️</span>
              <span>Claro</span>
            }
          </button>
        </div>

        <!-- Hero Typography -->
        <div class="space-y-2 pt-1 max-w-sm">
          <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono font-bold tracking-wider uppercase">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>100k Simulaciones Monte Carlo</span>
          </div>
          <h1 class="text-3xl font-black text-white tracking-tight leading-tight">
            Pronósticos +EV con rigor matemático.
          </h1>
          <p class="text-xs text-slate-400 font-medium leading-relaxed">
            Accede al terminal predictivo móvil sincronizado con resultados oficiales y cuotas de mercado.
          </p>
        </div>

      </div>

      <!-- BOTTOM CARD CONTAINER: Glassmorphism Card -->
      <div 
        class="w-full rounded-t-[36px] bg-[#0c1322]/90 backdrop-blur-2xl border-t border-white/10 px-6 pt-6 pb-8 shadow-[0_-15px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between relative z-10 transition-all duration-300"
        style="padding-bottom: max(env(safe-area-inset-bottom), 24px);"
      >
        <!-- Segmented Tab Pill: [Iniciar Sesión] | [Crear Cuenta] -->
        <div class="w-full p-1.5 rounded-2xl bg-white/5 border border-white/10 flex items-center mb-5">
          <button
            type="button"
            (click)="activeTab = 'login'"
            [class.bg-gradient-to-r]="activeTab === 'login'"
            [class.from-emerald-500]="activeTab === 'login'"
            [class.to-teal-500]="activeTab === 'login'"
            [class.text-slate-950]="activeTab === 'login'"
            [class.font-black]="activeTab === 'login'"
            [class.shadow-lg]="activeTab === 'login'"
            [class.text-slate-400]="activeTab !== 'login'"
            class="flex-1 py-2.5 rounded-xl text-xs tracking-wide transition-all text-center flex items-center justify-center space-x-1.5"
          >
            <span>🔐</span>
            <span>Iniciar Sesión</span>
          </button>
          <button
            type="button"
            (click)="activeTab = 'register'"
            [class.bg-gradient-to-r]="activeTab === 'register'"
            [class.from-emerald-500]="activeTab === 'register'"
            [class.to-teal-500]="activeTab === 'register'"
            [class.text-slate-950]="activeTab === 'register'"
            [class.font-black]="activeTab === 'register'"
            [class.shadow-lg]="activeTab === 'register'"
            [class.text-slate-400]="activeTab !== 'register'"
            class="flex-1 py-2.5 rounded-xl text-xs tracking-wide transition-all text-center flex items-center justify-center space-x-1.5"
          >
            <span>✨</span>
            <span>Crear Cuenta</span>
          </button>
        </div>

        <!-- Error Feedback Message -->
        @if (loginService.errorMessage()) {
          <div class="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 font-medium animate-fade-in">
            <span>⚠️</span>
            <span>{{ loginService.errorMessage() }}</span>
          </div>
        }

        <!-- TAB 1: FORMULARIO INICIAR SESIÓN -->
        @if (activeTab === 'login') {
          <form (ngSubmit)="onLogin()" class="space-y-4 animate-fade-in">
            
            <!-- Email -->
            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
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
                  class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 shadow-inner transition-all font-sans"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Contraseña
                </label>
                <span class="text-[10px] font-bold text-emerald-400 cursor-pointer hover:underline">¿Olvidaste tu contraseña?</span>
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
                  class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 shadow-inner transition-all font-sans"
                />
              </div>
            </div>

            <!-- Remember me -->
            <div class="flex items-center justify-between pt-1">
              <label class="flex items-center space-x-2 text-xs font-semibold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  [(ngModel)]="loginCreds.rememberMe"
                  class="rounded text-emerald-500 bg-white/5 border-white/20 focus:ring-emerald-500"
                />
                <span>Recordar sesión</span>
              </label>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loginService.isLoading()"
              class="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-2"
            >
              @if (loginService.isLoading()) {
                <span class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
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
          <form (ngSubmit)="onRegister()" class="space-y-3.5 animate-fade-in">
            
            <!-- Full Name -->
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Nombre y Apellido
              </label>
              <input
                type="text"
                name="fullName"
                required
                [(ngModel)]="registerData.fullName"
                placeholder="Luis Gallardo"
                class="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 shadow-inner transition-all font-sans"
              />
            </div>

            <!-- Email -->
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="regEmail"
                required
                [(ngModel)]="registerData.email"
                placeholder="tu@correo.com"
                class="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 shadow-inner transition-all font-sans"
              />
            </div>

            <!-- Password -->
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Contraseña
              </label>
              <input
                type="password"
                name="regPassword"
                required
                [(ngModel)]="registerData.password"
                placeholder="Mínimo 6 caracteres"
                class="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 shadow-inner transition-all font-sans"
              />
            </div>

            <!-- Confirm Password -->
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="regConfirmPassword"
                required
                [(ngModel)]="registerData.confirmPassword"
                placeholder="Repite tu contraseña"
                class="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 shadow-inner transition-all font-sans"
              />
            </div>

            <!-- Register Button -->
            <button
              type="submit"
              [disabled]="loginService.isLoading()"
              class="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-1"
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
        <div class="pt-5 text-center">
          <p class="text-[11px] text-slate-400 font-mono flex items-center justify-center space-x-1.5">
            <span>🔒</span>
            <span>Auditoría Inmutable SHA-256 • Sesión Protegida</span>
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
    const success = await this.loginService.login(this.loginCreds);
    if (success) {
      this.router.navigate(['/home']);
    }
  }

  public async onRegister(): Promise<void> {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }
    const success = await this.loginService.register(this.registerData);
    if (success) {
      this.router.navigate(['/home']);
    }
  }
}
