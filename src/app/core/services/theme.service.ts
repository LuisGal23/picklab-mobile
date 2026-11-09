import { Injectable, signal, computed, effect } from '@angular/core';

export type AppTheme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'picklab_mobile_theme';
  public theme = signal<AppTheme>('dark');
  public isDark = computed(() => this.theme() === 'dark');

  constructor() {
    this.initTheme();

    effect(() => {
      const current = this.theme();
      this.applyTheme(current);
    });
  }

  private initTheme(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY) as AppTheme | null;
      if (saved === 'dark' || saved === 'light') {
        this.theme.set(saved);
      } else {
        this.theme.set('dark'); // Default to dark mode as requested
      }
    } catch {
      this.theme.set('dark');
    }
  }

  public toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  public setTheme(newTheme: AppTheme): void {
    this.theme.set(newTheme);
    try {
      localStorage.setItem(this.STORAGE_KEY, newTheme);
    } catch {}
    this.applyTheme(newTheme);
  }

  private applyTheme(theme: AppTheme): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
  }
}
