import { Injectable, signal, computed } from '@angular/core';
import { MobilePickItem, PickTier, PickSport } from './picks.models';

@Injectable({
  providedIn: 'root'
})
export class PicksService {
  public selectedTier = signal<PickTier>('oficial');
  public selectedSport = signal<PickSport>('all');

  private allPicks = signal<MobilePickItem[]>([
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
      league: 'NBA',
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
      league: 'NBA',
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
  ]);

  public filteredPicks = computed(() => {
    const tier = this.selectedTier();
    const sport = this.selectedSport();
    let list = this.allPicks().filter(p => p.tier === tier);
    if (sport !== 'all') {
      list = list.filter(p => p.sport === sport);
    }
    return list;
  });

  public setTier(tier: PickTier) {
    this.selectedTier.set(tier);
  }

  public setSport(sport: PickSport) {
    this.selectedSport.set(sport);
  }
}
