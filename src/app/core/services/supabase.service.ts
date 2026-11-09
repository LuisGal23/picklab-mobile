import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private client: SupabaseClient | null = null;
  public user = signal<User | null>(null);
  public session = signal<Session | null>(null);
  public profile = signal<UserProfile | null>(null);
  public isReady = signal<boolean>(false);
  private readyPromise: Promise<boolean>;
  private resolveReady!: (val: boolean) => void;

  constructor() {
    this.readyPromise = new Promise(resolve => {
      this.resolveReady = resolve;
    });
    this.initSupabase();
  }

  public async ensureReady(): Promise<boolean> {
    if (this.isReady()) return !!this.client;
    await this.readyPromise;
    return !!this.client;
  }

  private initSupabase() {
    const url = environment.supabaseUrl;
    const key = environment.supabaseAnonKey;

    if (url && key) {
      this.setupClient(url, key);
    } else {
      this.isReady.set(true);
      if (this.resolveReady) this.resolveReady(false);
    }
  }

  private setupClient(url: string, key: string) {
    try {
      const cleanUrl = url.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
      this.client = createClient(cleanUrl, key);
      this.isReady.set(true);
      if (this.resolveReady) {
        this.resolveReady(true);
      }

      this.client.auth.getSession().then(({ data: { session } }) => {
        this.session.set(session);
        this.user.set(session?.user ?? null);
        if (session?.user) {
          this.loadUserProfile(session.user.id);
        }
      }).catch(() => {});

      this.client.auth.onAuthStateChange((_event, session) => {
        this.session.set(session);
        this.user.set(session?.user ?? null);
        if (session?.user) {
          this.loadUserProfile(session.user.id);
        } else {
          this.profile.set(null);
        }
      });
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      this.isReady.set(true);
      if (this.resolveReady) this.resolveReady(false);
    }
  }

  private async loadUserProfile(userId: string) {
    if (!this.client) return;
    try {
      const { data } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        this.profile.set(data as UserProfile);
      }
    } catch {}
  }

  public async signInWithEmail(email: string, password: string) {
    await this.ensureReady();
    if (!this.client) throw new Error('Supabase no está listo o configurado');
    return await this.client.auth.signInWithPassword({ email, password });
  }

  public async signUpWithEmail(email: string, password: string, fullName: string) {
    await this.ensureReady();
    if (!this.client) throw new Error('Supabase no está listo o configurado');
    return await this.client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
  }

  public async signOut() {
    if (!this.client) return;
    await this.client.auth.signOut();
    this.session.set(null);
    this.user.set(null);
    this.profile.set(null);
  }

  public getClient(): SupabaseClient | null {
    return this.client;
  }
}
