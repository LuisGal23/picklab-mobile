import { Injectable, signal } from '@angular/core';
import { LoginCredentials, UserSession } from './login.models';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly SESSION_KEY = 'picklab_mobile_session';
  public isLoading = signal<boolean>(false);
  public currentSession = signal<UserSession | null>(null);

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = localStorage.getItem(this.SESSION_KEY);
      if (data) {
        this.currentSession.set(JSON.parse(data));
      }
    } catch {
      // Safe fallback
    }
  }

  public async login(credentials: LoginCredentials): Promise<boolean> {
    this.isLoading.set(true);
    // Simulate lightweight auth
    await new Promise(r => setTimeout(r, 800));

    const session: UserSession = {
      token: 'session_' + Date.now(),
      user: {
        id: 'usr_1',
        email: credentials.email || 'usuario@picklab.io',
        name: credentials.email ? credentials.email.split('@')[0] : 'Luis Gal',
        isGuest: false
      }
    };

    this.currentSession.set(session);
    if (credentials.rememberMe && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
    this.isLoading.set(false);
    return true;
  }

  public loginAsGuest(): void {
    const session: UserSession = {
      token: 'guest_' + Date.now(),
      user: {
        id: 'guest',
        email: 'invitado@picklab.io',
        name: 'Invitado',
        isGuest: true
      }
    };
    this.currentSession.set(session);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
  }

  public logout(): void {
    this.currentSession.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.SESSION_KEY);
    }
  }
}
