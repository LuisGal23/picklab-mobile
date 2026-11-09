import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { LoginCredentials } from './services/login.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#F5F6F8] flex flex-col justify-between px-6 py-8 select-none font-sans" style="padding-top: max(env(safe-area-inset-top), 32px); padding-bottom: max(env(safe-area-inset-bottom), 24px);">
      
      <!-- Top Bar: Logo & Edge-to-Edge Indicator -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-xl bg-slate-950 p-1 flex items-center justify-center shadow-md">
            <img src="assets/logo.png" alt="PickLab Logo" class="w-full h-full object-contain rounded-lg" />
          </div>
          <span class="font-black text-xl tracking-tighter text-slate-950 font-mono">
            PICK<span class="text-emerald-500">LAB</span>
          </span>
        </div>

        <button
          (click)="onGuest()"
          class="text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-full bg-slate-200/60 active:scale-95 transition-all"
        >
          Saltar / Invitado &rarr;
        </button>
      </div>

      <!-- Main Login Form Card -->
      <div class="my-auto py-6 space-y-6">
        
        <!-- Welcome Header -->
        <div class="space-y-1.5">
          <h2 class="text-3xl font-black text-slate-950 tracking-tight leading-tight">
            Bienvenido de nuevo
          </h2>
          <p class="text-xs text-slate-500 font-medium">
            Ingresa a tu cuenta para auditar picks y probabilidades en vivo.
          </p>
        </div>

        <!-- Inputs Card -->
        <div class="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 space-y-4">
          
          <!-- Email Input -->
          <div class="space-y-1.5">
            <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Correo Electrónico</label>
            <div class="relative flex items-center">
              <span class="absolute left-4 text-slate-400">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                type="email"
                [(ngModel)]="credentials.email"
                placeholder="tu@email.com"
                class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Contraseña</label>
              <a href="javascript:void(0)" class="text-[11px] font-bold text-emerald-600">¿Olvidaste?</a>
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
                [(ngModel)]="credentials.password"
                placeholder="••••••••"
                class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <!-- Remember me checkbox -->
          <div class="flex items-center justify-between pt-1">
            <label class="flex items-center space-x-2 text-xs font-medium text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                [(ngModel)]="credentials.rememberMe"
                class="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
              />
              <span>Recordar sesión</span>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="button"
            (click)="onSubmit()"
            [disabled]="loginService.isLoading()"
            class="w-full py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 active:scale-[0.98] text-white font-black text-sm tracking-wide shadow-lg shadow-slate-950/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            @if (loginService.isLoading()) {
              <span class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              <span>Iniciando...</span>
            } @else {
              <span>Entrar a PickLab</span>
              <span>&rarr;</span>
            }
          </button>

        </div>

      </div>

      <!-- Bottom Disclaimer -->
      <div class="text-center space-y-2">
        <p class="text-xs text-slate-400 font-medium">
          ¿No tienes una cuenta aún?
          <button (click)="onGuest()" class="text-emerald-600 font-bold hover:underline">
            Crear cuenta o entrar libre
          </button>
        </p>
        <span class="text-[10px] text-slate-400 font-mono block">
          Auditoría Pública Inmutable • Algoritmo Cuantitativo
        </span>
      </div>

    </div>
  `
})
export class LoginComponent {
  public loginService = inject(LoginService);
  private router = inject(Router);

  public credentials: LoginCredentials = {
    email: '',
    password: '',
    rememberMe: true
  };

  public async onSubmit(): Promise<void> {
    await this.loginService.login(this.credentials);
    this.router.navigate(['/home']);
  }

  public onGuest(): void {
    this.loginService.loginAsGuest();
    this.router.navigate(['/home']);
  }
}
