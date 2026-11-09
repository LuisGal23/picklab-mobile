import { Injectable, signal, computed } from '@angular/core';
import { MobilePickItem, PickTier } from './picks.models';

@Injectable({
  providedIn: 'root'
})
export class PicksService {
  public selectedTier = signal<PickTier>('oficial');

  private allPicks = signal<MobilePickItem[]>([
    {
      id: 'p-1',
      tier: 'oficial',
      sport: 'soccer',
      league: 'LaLiga',
      matchTitle: 'Atlético de Madrid vs FC Barcelona',
      kickoff: 'Hoy 15:00 CDMX',
      selection: 'Total Goles: Más de 2.5',
      odds: 1.88,
      probModelPct: 62.4,
      edgePct: 17.3,
      simulations: 100000,
      isSuspicious: false
    },
    {
      id: 'p-2',
      tier: 'oficial',
      sport: 'soccer',
      league: 'Premier League',
      matchTitle: 'Arsenal FC vs Chelsea FC',
      kickoff: 'Hoy 11:30 CDMX',
      selection: 'Ganador: Arsenal ML',
      odds: 1.85,
      probModelPct: 58.4,
      edgePct: 8.0,
      simulations: 100000,
      isSuspicious: false
    },
    {
      id: 'p-3',
      tier: 'probable',
      sport: 'nba',
      league: 'NBA',
      matchTitle: 'Boston Celtics vs Miami Heat',
      kickoff: 'Hoy 19:00 CDMX',
      selection: 'Hándicap: Celtics -5.5',
      odds: 1.90,
      probModelPct: 56.1,
      edgePct: 6.6,
      simulations: 100000,
      isSuspicious: false
    },
    {
      id: 'p-4',
      tier: 'sospechoso',
      sport: 'soccer',
      league: 'Serie A',
      matchTitle: 'Verona vs Monza',
      kickoff: 'Hoy 14:45 CDMX',
      selection: 'Goles: Under 1.5',
      odds: 3.40,
      probModelPct: 38.0,
      edgePct: 29.2,
      simulations: 100000,
      isSuspicious: true,
      suspiciousReason: 'Alerta Monte Carlo: Cuota presenta divergencia anómala de +29.2% de valor. Posible trampa de mercado o baja de último minuto.'
    }
  ]);

  public filteredPicks = computed(() => {
    const tier = this.selectedTier();
    return this.allPicks().filter(p => p.tier === tier);
  });

  public setTier(tier: PickTier) {
    this.selectedTier.set(tier);
  }
}
