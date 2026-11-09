import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SplashService } from './services/splash.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-[#070b14] flex flex-col items-center justify-between px-6 py-12 z-50 select-none overflow-hidden" style="padding-top: max(env(safe-area-inset-top), 48px); padding-bottom: max(env(safe-area-inset-bottom), 36px);">
      
      <!-- Top Subtle Indicator -->
      <div class="flex items-center space-x-2 text-xs font-mono text-cyan-400/80 animate-fade-in">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>QUANTUM SPORTS TELEMETRY</span>
      </div>

      <!-- Center Logo with Animated Neon Glow Waves -->
      <div class="flex flex-col items-center space-y-6 text-center my-auto">
        <!-- Logo Container with Pulsing Ripple Rings -->
        <div class="relative flex items-center justify-center">
          <div class="absolute w-44 h-44 rounded-full bg-emerald-500/15 animate-ping opacity-60"></div>
          <div class="absolute w-36 h-36 rounded-3xl bg-cyan-500/20 blur-xl animate-pulse"></div>
          
          <div class="relative w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#0a1224] to-[#070d18] border-2 border-emerald-400/40 p-2 shadow-2xl flex items-center justify-center transform transition-transform duration-700 hover:scale-105">
            <img src="assets/logo.png" alt="PickLab Logo" class="w-full h-full object-contain rounded-2xl drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]" />
          </div>
        </div>

        <!-- Brand Name & Typography -->
        <div class="space-y-2">
          <h1 class="text-4xl font-black font-mono tracking-tighter text-white">
            PICK<span class="text-emerald-400">LAB</span>
          </h1>
          <p class="text-xs font-medium text-slate-400 tracking-wide">
            Simulación Monte Carlo • 100,000 Iteraciones
          </p>
        </div>
      </div>

      <!-- Bottom Progress Bar & Version -->
      <div class="w-full max-w-xs space-y-3 text-center">
        <div class="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full animate-progress"></div>
        </div>
        <p class="text-[11px] font-mono text-slate-400 truncate">
          {{ splashService.state().telemetryStatus }}
        </p>
        <span class="text-[10px] text-slate-500 font-mono block">v{{ splashService.state().version }} • Android Edge-to-Edge</span>
      </div>

    </div>
  `,
  styles: [`
    @keyframes progress {
      0% { width: 0%; }
      50% { width: 70%; }
      100% { width: 100%; }
    }
    .animate-progress {
      animation: progress 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
  `]
})
export class SplashComponent implements OnInit {
  public splashService = inject(SplashService);
  private router = inject(Router);

  ngOnInit(): void {
    setTimeout(() => {
      this.splashService.setLoaded();
      const isAuth = this.splashService.checkAuthentication();
      if (isAuth) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    }, 2300);
  }
}
