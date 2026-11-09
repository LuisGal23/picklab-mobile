import { Injectable, signal, computed } from '@angular/core';

export interface MatchNotification {
  id: string;
  matchId: string;
  matchTitle: string;
  pickTitle: string;
  status: 'pending' | 'won' | 'lost';
  odds?: number;
  resultMessage: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly STORAGE_KEY = 'picklab_match_notifications';
  public notifications = signal<MatchNotification[]>([]);
  public subscribedIds = signal<string[]>([]);
  public isOpen = signal<boolean>(false);

  public unreadCount = computed(() => this.notifications().length);

  constructor() {
    this.restoreNotifications();
  }

  private restoreNotifications(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.notifications.set(parsed.notifications || []);
        this.subscribedIds.set(parsed.subscribedIds || []);
      } else {
        // Seed initial notifications so the bell has active telemetry
        const initial: MatchNotification[] = [
          {
            id: 'notif_1',
            matchId: 'm1',
            matchTitle: 'Arsenal vs Chelsea',
            pickTitle: 'Over 2.5 Goles',
            status: 'won',
            odds: 1.88,
            resultMessage: '¡Pick Ganado! Marcador final 2-1 (Total 3 goles).',
            timestamp: Date.now() - 3600000 * 2
          },
          {
            id: 'notif_2',
            matchId: 'm2',
            matchTitle: 'Lakers vs Warriors',
            pickTitle: 'Lakers +4.5 Spread',
            status: 'pending',
            odds: 1.91,
            resultMessage: 'Monitoreando partido en vivo...',
            timestamp: Date.now() - 1800000
          }
        ];
        this.notifications.set(initial);
        this.subscribedIds.set(['m1', 'm2']);
      }
    } catch {
      // Safe fallback
    }
  }

  private save(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        notifications: this.notifications(),
        subscribedIds: this.subscribedIds()
      }));
    } catch {}
  }

  public isSubscribed(matchId: string): boolean {
    return this.subscribedIds().includes(matchId);
  }

  public toggleSubscription(matchId: string, matchTitle: string, pickTitle: string, odds?: number): boolean {
    const isSub = this.isSubscribed(matchId);
    if (isSub) {
      // Remove subscription
      this.subscribedIds.update(ids => ids.filter(id => id !== matchId));
      this.notifications.update(notifs => notifs.filter(n => n.matchId !== matchId));
      this.save();
      return false;
    } else {
      // Add subscription
      this.subscribedIds.update(ids => [...ids, matchId]);
      const newNotif: MatchNotification = {
        id: 'notif_' + Date.now(),
        matchId,
        matchTitle,
        pickTitle,
        odds,
        status: 'pending',
        resultMessage: 'Monitoreando en vivo: Te avisaremos cuando se cumpla el pick.',
        timestamp: Date.now()
      };
      this.notifications.update(notifs => [newNotif, ...notifs]);
      this.save();
      return true;
    }
  }

  public clearAll(): void {
    this.notifications.set([]);
    this.subscribedIds.set([]);
    this.save();
  }

  public toggleModal(): void {
    this.isOpen.update(v => !v);
  }
}
