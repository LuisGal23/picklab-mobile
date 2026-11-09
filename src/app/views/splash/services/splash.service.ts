import { Injectable, signal } from '@angular/core';
import { SplashState } from './splash.models';

@Injectable({
  providedIn: 'root'
})
export class SplashService {
  public state = signal<SplashState>({
    isLoaded: false,
    version: '1.0.0',
    telemetryStatus: 'Inicializando motor Monte Carlo vectorizado...'
  });

  public checkAuthentication(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return !!localStorage.getItem('picklab_mobile_session');
  }

  public setLoaded(): void {
    this.state.update(s => ({ ...s, isLoaded: true }));
  }
}
