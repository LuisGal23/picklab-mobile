import { Injectable, signal } from '@angular/core';
import { FollowItem } from './follows.models';

@Injectable({
  providedIn: 'root'
})
export class FollowsService {
  private items = signal<FollowItem[]>([
    {
      id: 'f-1',
      name: 'FC Barcelona',
      type: 'team',
      sport: 'soccer',
      nextMatch: 'vs Atlético de Madrid • Hoy 15:00',
      activePicksCount: 3
    },
    {
      id: 'f-2',
      name: 'Premier League',
      type: 'league',
      sport: 'soccer',
      nextMatch: 'Arsenal vs Chelsea • Hoy 11:30',
      activePicksCount: 8
    },
    {
      id: 'f-3',
      name: 'Boston Celtics',
      type: 'team',
      sport: 'nba',
      nextMatch: 'vs Miami Heat • Hoy 19:00',
      activePicksCount: 2
    }
  ]);

  public getFollows() {
    return this.items.asReadonly();
  }
}
