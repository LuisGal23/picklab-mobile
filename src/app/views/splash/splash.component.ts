import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SplashService } from './services/splash.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="fixed inset-0 bg-[#070b14] flex flex-col items-center justify-between px-6 py-10 z-50 select-none overflow-hidden transition-opacity duration-700"
      [class.opacity-0]="isFadingOut"
      style="padding-top: max(env(safe-area-inset-top), 48px); padding-bottom: max(env(safe-area-inset-bottom), 36px);"
    >
      
      <!-- Top Subtle Indicator -->
      <div class="flex items-center space-x-2 text-xs font-mono text-cyan-400/90 animate-fade-in">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span class="tracking-widest">PICKLAB TELEMETRY</span>
      </div>

      <!-- Center Logo with Smooth Bottom-to-Center Float Animation -->
      <div class="flex flex-col items-center space-y-7 text-center my-auto animate-rise-up">
        
        <!-- Glowing Logo Container (Transparent PNG Emblem) -->
        <div class="relative flex items-center justify-center">
          <div class="absolute w-44 h-44 rounded-full bg-emerald-500/20 blur-2xl animate-pulse"></div>
          <div class="absolute w-36 h-36 rounded-full bg-cyan-500/15 animate-ping opacity-50"></div>
          
          <div class="relative w-28 h-28 flex items-center justify-center drop-shadow-[0_0_25px_rgba(34,197,94,0.45)]">
            <img 
              src="assets/logo.png" 
              alt="PickLab Logo" 
              class="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
            />
          </div>
        </div>

        <!-- Brand Name & Description -->
        <div class="space-y-2">
          <h1 class="text-4xl font-black font-mono tracking-tighter text-white">
            PICK<span class="text-emerald-400">LAB</span>
          </h1>
          <p class="text-xs font-medium text-slate-400 tracking-wide">
            Simulación Monte Carlo • 100,000 Iteraciones
          </p>
        </div>

      </div>

      <!-- Bottom Progress Bar & Telemetry Status -->
      <div class="w-full max-w-xs space-y-3 text-center animate-fade-in">
        <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 rounded-full animate-progress"></div>
        </div>
        <p class="text-[11px] font-mono text-slate-400 truncate">
          {{ currentStatus }}
        </p>
        <span class="text-[10px] text-slate-500 font-mono block">v1.0.0 • Motor Cuantitativo Deportivo</span>
      </div>

    </div>
  `,
  styles: [`
    @keyframes riseUp {
      0% {
        opacity: 0;
        transform: translateY(70px) scale(0.92);
      }
      60% {
        opacity: 1;
        transform: translateY(-8px) scale(1.02);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes progress {
      0% { width: 0%; }
      30% { width: 45%; }
      70% { width: 85%; }
      100% { width: 100%; }
    }

    .animate-rise-up {
      animation: riseUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .animate-progress {
      animation: progress 2.1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
  `]
})
export class SplashComponent implements OnInit {
  public splashService = inject(SplashService);
  private router = inject(Router);

  public isFadingOut = false;
  public currentStatus = 'Cargando modelos probabilísticos...';

  ngOnInit(): void {
    setTimeout(() => {
      this.currentStatus = 'Optimizando cuotas y picks con valor...';
    }, 900);

    setTimeout(() => {
      this.currentStatus = 'Sistema listo.';
      this.isFadingOut = true;
    }, 1900);

    setTimeout(() => {
      this.splashService.setLoaded();
      const isAuth = this.splashService.checkAuthentication();
      if (isAuth) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    }, 2400);
  }
}
