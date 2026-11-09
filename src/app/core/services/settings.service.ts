import { Injectable, signal, effect, inject } from '@angular/core';
import { ThemeService } from './theme.service';
import { LoginService } from '../../views/auth/login/services/login.service';

export interface NotchOption {
  id: string;
  label: string;
  value: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly NOTCH_KEY = 'picklab_notch_offset';
  private readonly LANG_KEY = 'picklab_language';

  public themeService = inject(ThemeService);
  public loginService = inject(LoginService);

  public notchOptions: NotchOption[] = [
    { id: 'standard', label: 'Estándar', value: 24, description: 'Barra normal (24px)' },
    { id: 'waterdrop', label: 'Gota de Agua', value: 38, description: 'Cámara gota / agujero (38px)' },
    { id: 'notch_max', label: 'Notch Amplio', value: 50, description: 'Isla Dinámica / Notch ancho (50px)' },
    { id: 'compact', label: 'Compacto', value: 16, description: 'Mínimo espacio superior (16px)' }
  ];

  public notchOffset = signal<number>(24);
  public language = signal<'es' | 'en'>('es');

  constructor() {
    this.initSettings();

    effect(() => {
      const offset = this.notchOffset();
      this.applyNotch(offset);
    });
  }

  private initSettings(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const savedNotch = localStorage.getItem(this.NOTCH_KEY);
      if (savedNotch) {
        this.notchOffset.set(Number(savedNotch));
      }
      const savedLang = localStorage.getItem(this.LANG_KEY) as 'es' | 'en' | null;
      if (savedLang === 'es' || savedLang === 'en') {
        this.language.set(savedLang);
      }
    } catch {}
  }

  public setNotchOffset(val: number): void {
    this.notchOffset.set(val);
    try {
      localStorage.setItem(this.NOTCH_KEY, String(val));
    } catch {}
    this.applyNotch(val);
  }

  public setLanguage(lang: 'es' | 'en'): void {
    this.language.set(lang);
    try {
      localStorage.setItem(this.LANG_KEY, lang);
    } catch {}
  }

  private applyNotch(val: number): void {
    if (typeof document === 'undefined') return;
    document.documentElement.style.setProperty('--app-notch-top', `${val}px`);
  }
}
