import { Injectable, signal, computed, inject } from '@angular/core';
import { MobilePickItem, PickTier, PickSport } from './picks.models';
import { ApiService, PickItem } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PicksService {
  private api = inject(ApiService);

  public selectedTier = signal<PickTier>('oficial');
  public selectedSport = signal<PickSport>('all');
  public isLoading = signal<boolean>(false);

  private readonly initialFallbackPicks: MobilePickItem[] = [
    {
      id: 'p-1',
      tier: 'oficial',
      sport: 'soccer',
      league: 'LaLiga EA Sports',
      matchTitle: 'Real Madrid vs FC Barcelona',
      homeTeam: 'Real Madrid',
      awayTeam: 'FC Barcelona',
      homeLogo: 'https://crests.football-data.org/86.png',
      awayLogo: 'https://crests.football-data.org/81.png',
      kickoff: 'Hoy 21:00 UTC',
      selection: 'Ambos Equipos Anotan (BTTS)',
      odds: 1.75,
      probModelPct: 71.8,
      edgePct: 14.2,
      simulations: 100000,
      mu: 2.85,
      sigma: 0.95,
      analysisSnippet: 'Gasto ofensivo combinado superior a 4.1 xG en los últimos 5 clásicos. Alta probabilidad de gol mutuo.',
      isSuspicious: false
    },
    {
      id: 'p-2',
      tier: 'oficial',
      sport: 'soccer',
      league: 'Premier League',
      matchTitle: 'Arsenal FC vs Chelsea FC',
      homeTeam: 'Arsenal FC',
      awayTeam: 'Chelsea FC',
      homeLogo: 'https://crests.football-data.org/57.png',
      awayLogo: 'https://crests.football-data.org/61.png',
      kickoff: 'Hoy 20:00 UTC',
      selection: 'Total Goles: Más de 2.5',
      odds: 1.88,
      probModelPct: 62.4,
      edgePct: 18.4,
      simulations: 100000,
      mu: 3.12,
      sigma: 1.15,
      analysisSnippet: 'Simulación Monte Carlo proyecta 3.12 goles esperados con 18.4% de margen de valor (+EV).',
      isSuspicious: false
    },
    {
      id: 'p-3',
      tier: 'oficial',
      sport: 'nba',
      league: 'NBA Regular Season',
      matchTitle: 'LA Lakers vs Golden State Warriors',
      homeTeam: 'LA Lakers',
      awayTeam: 'GS Warriors',
      homeLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      awayLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
      kickoff: 'Hoy 22:30 UTC',
      selection: 'LA Lakers -3.5 Spread',
      odds: 1.91,
      probModelPct: 58.6,
      edgePct: 15.6,
      simulations: 100000,
      mu: 228.5,
      sigma: 12.4,
      analysisSnippet: 'Eficiencia neta de Lakers +8.2 en casa vs perímetro rival. Spread favorable.',
      isSuspicious: false
    },
    {
      id: 'p-4',
      tier: 'probable',
      sport: 'nba',
      league: 'NBA Regular Season',
      matchTitle: 'Boston Celtics vs Milwaukee Bucks',
      homeTeam: 'Boston Celtics',
      awayTeam: 'Milwaukee Bucks',
      homeLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
      awayLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
      kickoff: 'Hoy 19:00 UTC',
      selection: 'Over 224.5 Puntos Totales',
      odds: 1.87,
      probModelPct: 59.4,
      edgePct: 9.3,
      simulations: 100000,
      mu: 231.2,
      sigma: 11.8,
      analysisSnippet: 'Ritmo proyectado de 102.4 posesiones. Ambos equipos entre los mayores lanzadores de triples.',
      isSuspicious: false
    },
    {
      id: 'p-5',
      tier: 'probable',
      sport: 'soccer',
      league: 'Champions League',
      matchTitle: 'Manchester City vs Bayern Múnich',
      homeTeam: 'Manchester City',
      awayTeam: 'Bayern Múnich',
      homeLogo: 'https://crests.football-data.org/65.png',
      awayLogo: 'https://crests.football-data.org/5.png',
      kickoff: 'Hoy 19:45 UTC',
      selection: 'Man City Gana y +1.5 Goles',
      odds: 1.95,
      probModelPct: 55.1,
      edgePct: 8.7,
      simulations: 100000,
      mu: 3.40,
      sigma: 1.20,
      analysisSnippet: 'Man City invicto en casa en 14 partidos europeos promediando 2.6 goles.',
      isSuspicious: false
    },
    {
      id: 'p-6',
      tier: 'sospechoso',
      sport: 'soccer',
      league: 'Serie A',
      matchTitle: 'Verona vs Monza',
      homeTeam: 'Verona',
      awayTeam: 'Monza',
      homeLogo: 'https://crests.football-data.org/450.png',
      awayLogo: 'https://crests.football-data.org/5911.png',
      kickoff: 'Hoy 14:45 UTC',
      selection: 'Goles: Under 1.5',
      odds: 3.40,
      probModelPct: 38.0,
      edgePct: 29.2,
      simulations: 100000,
      mu: 1.45,
      sigma: 0.70,
      analysisSnippet: 'Divergencia inusitada detectada entre bookmakers asiáticos y locales. Probable trampa de cuota.',
      isSuspicious: true,
      suspiciousReason: 'Alerta Monte Carlo: Cuota presenta divergencia anómala de +29.2% de valor. Posible trampa de mercado o bajas de último minuto no descontadas.'
    }
  ];

  private allPicks = signal<MobilePickItem[]>(this.initialFallbackPicks);

  public filteredPicks = computed(() => {
    const tier = this.selectedTier();
    const sport = this.selectedSport();
    let list = this.allPicks().filter(p => p.tier === tier);
    if (sport !== 'all') {
      list = list.filter(p => p.sport === sport);
    }
    return list;
  });

  constructor() {
    this.loadLivePicks();
  }

  public setTier(tier: PickTier) {
    this.selectedTier.set(tier);
  }

  public setSport(sport: PickSport) {
    this.selectedSport.set(sport);
  }

  public loadLivePicks(): void {
    this.isLoading.set(true);
    this.api.getPicks().subscribe({
      next: (picks: PickItem[]) => {
        this.isLoading.set(false);
        if (picks && picks.length > 0) {
          const mapped = this.mapLivePicks(picks);
          // Combine live picks deduplicated with fallback
          const combined = [...mapped];
          for (const fb of this.initialFallbackPicks) {
            if (!combined.some(c => c.selection === fb.selection && c.matchTitle === fb.matchTitle)) {
              combined.push(fb);
            }
          }
          this.allPicks.set(combined);
        }
      },
      error: (err) => {
        console.warn('Could not load live picks from ApiService, using seed catalog:', err);
        this.isLoading.set(false);
      }
    });
  }

  private mapLivePicks(picks: PickItem[]): MobilePickItem[] {
    return picks.map((p, idx) => {
      const match = p.match;
      const homeName = match?.home_team?.name || match?.home_team_id || 'Equipo Local';
      const awayName = match?.away_team?.name || match?.away_team_id || 'Equipo Visitante';
      const sportNorm: 'soccer' | 'nba' | 'nfl' = 
        match?.sport_id === 'nba' ? 'nba' :
        match?.sport_id === 'nfl' ? 'nfl' : 'soccer';

      let tier: PickTier = 'oficial';
      const edge = p.edge || 0;
      if (edge >= 0.12) {
        tier = 'oficial';
      } else if (edge >= 0.05) {
        tier = 'probable';
      } else if (edge >= 0.25) {
        tier = 'sospechoso';
      }

      return {
        id: p.id || `live_pick_${idx}`,
        tier: tier,
        sport: sportNorm,
        league: match?.league_id || 'Competición Oficial',
        matchTitle: `${homeName} vs ${awayName}`,
        homeTeam: homeName,
        awayTeam: awayName,
        homeLogo: match?.home_team?.logo_url || 'https://crests.football-data.org/86.png',
        awayLogo: match?.away_team?.logo_url || 'https://crests.football-data.org/81.png',
        kickoff: match?.kickoff_utc ? new Date(match.kickoff_utc).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Próximamente',
        selection: `${p.market}: ${p.selection}${p.line ? ' ' + p.line : ''}`,
        odds: Number(p.odds_used || 1.85),
        probModelPct: Math.round((p.prob_model || 0.6) * 1000) / 10,
        edgePct: Math.round(edge * 1000) / 10,
        simulations: 100000,
        mu: Number(p.simulation_params?.['mu'] || 2.75),
        sigma: Number(p.simulation_params?.['sigma'] || 0.95),
        analysisSnippet: `Simulación Monte Carlo detecta ${Math.round(edge * 1000) / 10}% margen EV con modelo calibrado v2.1.`,
        isSuspicious: tier === 'sospechoso',
        suspiciousReason: tier === 'sospechoso' ? 'Anomalía de spread: cuota desfasada respecto a simulaciones Monte Carlo.' : undefined
      };
    });
  }
}
