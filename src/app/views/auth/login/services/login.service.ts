import { Injectable, signal } from '@angular/core';
import { LoginCredentials, RegisterData, UserSession } from './login.models';

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
    } catch {}
  }

  public async login(credentials: LoginCredentials): Promise<boolean> {
    this.isLoading.set(true);
    await new Promise(r => setTimeout(r, 650));

    const session: UserSession = {
      token: 'session_' + Date.now(),
      user: {
        id: 'usr_' + Date.now(),
        email: credentials.email || 'usuario@picklab.io',
        name: credentials.email ? credentials.email.split('@')[0] : 'Luis Gal',
        isGuest: false
      }
    };

    this.currentSession.set(session);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
    this.isLoading.set(false);
    return true;
  }

  public async register(data: RegisterData): Promise<boolean> {
    this.isLoading.set(true);
    await new Promise(r => setTimeout(r, 750));

    const session: UserSession = {
      token: 'session_' + Date.now(),
      user: {
        id: 'usr_' + Date.now(),
        email: data.email,
        name: data.fullName || (data.email ? data.email.split('@')[0] : 'Usuario'),
        isGuest: false
      }
    };

    this.currentSession.set(session);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
    this.isLoading.set(false);
    return true;
  }

  public updateUserName(newName: string): void {
    const cur = this.currentSession();
    if (cur) {
      cur.user.name = newName;
      this.currentSession.set({ ...cur });
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(cur));
      }
    }
  }

  public logout(): void {
    this.currentSession.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.SESSION_KEY);
    }
  }
}
