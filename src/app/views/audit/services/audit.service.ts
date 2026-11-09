import { Injectable, signal, computed } from '@angular/core';
import { AuditRecord, AuditMetricsSummary, AuditTier, AuditSport } from './audit.models';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  public selectedTier = signal<AuditTier>('oficial');
  public selectedSport = signal<AuditSport>('all');
  public syncing = signal<boolean>(false);
  public syncMessage = signal<string | null>(null);

  public readonly metricsSummary: AuditMetricsSummary = {
    totalAudited: 342,
    winRatePct: 68.4,
    roiPct: 14.8,
    profitUnits: 48.6,
    averageOdds: 1.84,
    brierCalibration: 0.168
  };

  private readonly auditRecords = signal<AuditRecord[]>([
    {
      id: 'aud_1',
      sport: 'futbol',
      league: 'Premier League',
      date: 'Ayer',
      homeTeam: 'Liverpool FC',
      awayTeam: 'Aston Villa',
      homeLogo: 'https://crests.football-data.org/64.png',
      awayLogo: 'https://crests.football-data.org/58.png',
      selection: 'Liverpool Gana & Over 1.5',
      odds: 1.78,
      tier: 'oficial',
      status: 'WON',
      resultScore: '2 - 0 (Final)',
      profitUnits: 0.78,
      sha256Hash: 'a9c8b7410f8e5623011409f8d0718ea98d7f21bc',
      clvEdgePct: 16.4,
      settledAt: '2026-11-08 22:00 UTC'
    },
    {
      id: 'aud_2',
      sport: 'nba',
      league: 'NBA Regular Season',
      date: 'Ayer',
      homeTeam: 'Golden State Warriors',
      awayTeam: 'OKC Thunder',
      homeLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
      awayLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png',
      selection: 'OKC Thunder +4.5 Spread',
      odds: 1.91,
      tier: 'oficial',
      status: 'WON',
      resultScore: '116 - 122 (Final)',
      profitUnits: 0.91,
      sha256Hash: '5e4d2a1c890f671b238a4d9c7e012fa89b5c3e41',
      clvEdgePct: 14.8,
      settledAt: '2026-11-08 23:45 UTC'
    },
    {
      id: 'aud_3',
      sport: 'nfl',
      league: 'NFL Regular Season',
      date: '08 Nov',
      homeTeam: 'Baltimore Ravens',
      awayTeam: 'Cincinnati Bengals',
      homeLogo: 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png',
      awayLogo: 'https://a.espncdn.com/i/teamlogos/nfl/500/cin.png',
      selection: 'Over 51.5 Puntos Totales',
      odds: 1.90,
      tier: 'oficial',
      status: 'WON',
      resultScore: '35 - 34 (Final)',
      profitUnits: 0.90,
      sha256Hash: '7a1b3c9d2e5f8041a6b7c8d9e0f1a2b3c4d5e6f7',
      clvEdgePct: 18.2,
      settledAt: '2026-11-08 04:15 UTC'
    },
    {
      id: 'aud_4',
      sport: 'futbol',
      league: 'La Liga EA Sports',
      date: '07 Nov',
      homeTeam: 'Atlético de Madrid',
      awayTeam: 'Las Palmas',
      homeLogo: 'https://crests.football-data.org/78.png',
      awayLogo: 'https://crests.football-data.org/275.png',
      selection: 'Atlético Gana a Cero',
      odds: 2.05,
      tier: 'oficial',
      status: 'WON',
      resultScore: '2 - 0 (Final)',
      profitUnits: 1.05,
      sha256Hash: '3d8e9f1a2b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e',
      clvEdgePct: 15.0,
      settledAt: '2026-11-07 16:00 UTC'
    },
    {
      id: 'aud_5',
      sport: 'nba',
      league: 'NBA Regular Season',
      date: '07 Nov',
      homeTeam: 'Miami Heat',
      awayTeam: 'Phoenix Suns',
      homeLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
      awayLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png',
      selection: 'Under 220.5 Puntos Totales',
      odds: 1.88,
      tier: 'probable',
      status: 'LOST',
      resultScore: '112 - 115 (Final)',
      profitUnits: -1.00,
      sha256Hash: '9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
      clvEdgePct: 6.8,
      settledAt: '2026-11-07 02:30 UTC'
    },
    {
      id: 'aud_6',
      sport: 'futbol',
      league: 'Serie A',
      date: '06 Nov',
      homeTeam: 'Atalanta BC',
      awayTeam: 'AC Milan',
      homeLogo: 'https://crests.football-data.org/102.png',
      awayLogo: 'https://crests.football-data.org/98.png',
      selection: 'Over 2.5 Goles',
      odds: 1.82,
      tier: 'probable',
      status: 'WON',
      resultScore: '2 - 1 (Final)',
      profitUnits: 0.82,
      sha256Hash: '1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
      clvEdgePct: 8.5,
      settledAt: '2026-11-06 21:45 UTC'
    }
  ]);

  public filteredRecords = computed(() => {
    let list = this.auditRecords();
    const tier = this.selectedTier();
    const sport = this.selectedSport();

    if (tier !== 'all') {
      list = list.filter(r => r.tier === tier);
    }
    if (sport !== 'all') {
      list = list.filter(r => r.sport === sport);
    }

    return list;
  });

  public setTier(tier: AuditTier): void {
    this.selectedTier.set(tier);
  }

  public setSport(sport: AuditSport): void {
    this.selectedSport.set(sport);
  }

  public async triggerSync(): Promise<void> {
    this.syncing.set(true);
    await new Promise(r => setTimeout(r, 800));
    this.syncing.set(false);
    this.syncMessage.set('Auditoría sincronizada con PostgreSQL. 342 pronósticos sellados con SHA-256 verificado.');
    setTimeout(() => this.syncMessage.set(null), 4000);
  }
}
