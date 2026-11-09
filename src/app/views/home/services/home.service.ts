import { Injectable, signal } from '@angular/core';
import { HomeDashboardData, FeaturedMatchPick, MainMatchCard, MetricKpi } from './home.models';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private dashboardData = signal<HomeDashboardData>({
    userGreeting: 'Bring on Sunday, Alex 👏',
    dateSubtitle: 'Sunday, November 9 • 42 picks ready',
    metrics: [
      { label: 'Win Rate', value: '73%' },
      { label: 'Streak', value: '6W 🔥', highlight: true },
      { label: 'Avg Odds', value: '1.58' }
    ],
    featuredPick: {
      id: 'match-bar-atm-2026',
      league: 'LaLiga',
      homeTeam: 'Atlético de Madrid',
      awayTeam: 'FC Barcelona',
      kickoff: 'Today • 3:00 PM',
      pickTitle: 'Over 2.5 Goles',
      pickValue: '2.5',
      odds: 1.88,
      probPct: 62.4,
      edgePct: 17.3,
      mu: 3.12,
      sigma: 1.25,
      simulations: 100000,
      isOfficial: true
    },
    mainPicks: [
      {
        id: 'main-1',
        sport: 'soccer',
        league: 'Premier League',
        homeTeam: 'Arsenal FC',
        awayTeam: 'Chelsea FC',
        kickoff: 'Today 17:30',
        pickType: '↑ OVER 2.5 GOLES',
        odds: 1.85,
        probPct: 97,
        edgePct: 14.8,
        status: 'PENDING'
      },
      {
        id: 'main-2',
        sport: 'soccer',
        league: 'Serie A',
        homeTeam: 'AC Milan',
        awayTeam: 'Juventus FC',
        kickoff: 'Today 20:45',
        pickType: '↑ AMBOS ANOTAN (BTTS)',
        odds: 1.92,
        probPct: 88,
        edgePct: 12.1,
        status: 'PENDING'
      },
      {
        id: 'main-3',
        sport: 'nba',
        league: 'NBA',
        homeTeam: 'Boston Celtics',
        awayTeam: 'Miami Heat',
        kickoff: 'Today 21:00',
        pickType: '↑ CELTICS -5.5',
        odds: 1.90,
        probPct: 84,
        edgePct: 11.5,
        status: 'PENDING'
      },
      {
        id: 'main-4',
        sport: 'nfl',
        league: 'NFL',
        homeTeam: 'Kansas City Chiefs',
        awayTeam: 'Buffalo Bills',
        kickoff: 'Today 22:25',
        pickType: '↑ TOTAL OVER 47.5',
        odds: 1.95,
        probPct: 79,
        edgePct: 9.4,
        status: 'PENDING'
      }
    ]
  });

  public getDashboard() {
    return this.dashboardData.asReadonly();
  }

  public updateFeatured(pick: FeaturedMatchPick) {
    this.dashboardData.update(prev => ({ ...prev, featuredPick: pick }));
  }
}
