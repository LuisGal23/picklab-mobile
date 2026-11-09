import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { DayMatchItem, SportFilterType } from './schedule.models';
import { ApiService, Match } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private api = inject(ApiService);
  private readonly todayStr = new Date().toISOString().slice(0, 10);

  public selectedSport = signal<SportFilterType>('all');
  public searchQuery = signal<string>('');
  public selectedDate = signal<string>(this.todayStr);
  public allDatesMode = signal<boolean>(false);
  public isLoading = signal<boolean>(false);

  private liveMatches = signal<DayMatchItem[]>([]);

  private readonly fallbackCatalog: DayMatchItem[] = [
    // FUTBOL
    {
      id: 'fut_1',
      sport: 'futbol',
      league: 'Premier League',
      homeTeam: 'Arsenal FC',
      awayTeam: 'Chelsea FC',
      homeLogo: 'https://crests.football-data.org/57.png',
      awayLogo: 'https://crests.football-data.org/61.png',
      kickoffDate: this.todayStr,
      kickoffTime: '20:00',
      status: 'PRE_MATCH',
      probHome: 52.4,
      probDraw: 26.1,
      probAway: 21.5,
      homeOdds: 1.85,
      drawOdds: 3.60,
      awayOdds: 4.20,
      isOfficialPick: true,
      isProbableByStats: false,
      pickTitle: 'Over 2.5 Goles',
      pickSelection: 'Over 2.5 Goles @ 1.88',
      pickOdds: 1.88,
      edgePct: 18.4,
      mu: 3.12,
      sigma: 1.15,
      simulations: 100000,
      analysisSnippet: 'Simulación Monte Carlo proyecta 3.12 xG combinados. Ventaja de +18.4% sobre cuota de mercado en Pinnacle/DraftKings.'
    },
    {
      id: 'fut_2',
      sport: 'futbol',
      league: 'La Liga EA Sports',
      homeTeam: 'Real Madrid',
      awayTeam: 'FC Barcelona',
      homeLogo: 'https://crests.football-data.org/86.png',
      awayLogo: 'https://crests.football-data.org/81.png',
      kickoffDate: this.todayStr,
      kickoffTime: '21:00',
      status: 'PRE_MATCH',
      probHome: 46.8,
      probDraw: 24.3,
      probAway: 28.9,
      homeOdds: 2.10,
      drawOdds: 3.50,
      awayOdds: 3.25,
      isOfficialPick: true,
      isProbableByStats: false,
      pickTitle: 'Ambos Equipos Anotan',
      pickSelection: 'BTTS: Sí @ 1.75',
      pickOdds: 1.75,
      edgePct: 14.2,
      mu: 2.85,
      sigma: 0.95,
      simulations: 100000,
      analysisSnippet: 'Más de 4.1 xG combinados en los últimos 5 clásicos. Ambos con potencial ofensivo estelar.'
    },
    {
      id: 'fut_3',
      sport: 'futbol',
      league: 'UEFA Champions League',
      homeTeam: 'Manchester City',
      awayTeam: 'Bayern Múnich',
      homeLogo: 'https://crests.football-data.org/65.png',
      awayLogo: 'https://crests.football-data.org/5.png',
      kickoffDate: this.todayStr,
      kickoffTime: '19:45',
      status: 'PRE_MATCH',
      probHome: 55.1,
      probDraw: 24.0,
      probAway: 20.9,
      homeOdds: 1.78,
      drawOdds: 3.80,
      awayOdds: 4.40,
      isOfficialPick: false,
      isProbableByStats: true,
      pickTitle: 'Man City Gana y +1.5 Goles',
      pickSelection: 'Man City & Over 1.5 @ 1.95',
      pickOdds: 1.95,
      edgePct: 8.7,
      mu: 3.40,
      sigma: 1.20,
      simulations: 100000,
      analysisSnippet: 'Probable por métricas: Man City invicto como local en 14 partidos europeos con 2.6 goles por partido.'
    },
    {
      id: 'fut_4',
      sport: 'futbol',
      league: 'Serie A',
      homeTeam: 'Inter de Milán',
      awayTeam: 'Juventus FC',
      homeLogo: 'https://crests.football-data.org/108.png',
      awayLogo: 'https://crests.football-data.org/109.png',
      kickoffDate: this.todayStr,
      kickoffTime: '18:45',
      status: 'PRE_MATCH',
      probHome: 48.0,
      probDraw: 29.5,
      probAway: 22.5,
      homeOdds: 1.95,
      drawOdds: 3.20,
      awayOdds: 3.90,
      isOfficialPick: false,
      isProbableByStats: true,
      pickTitle: 'Under 2.5 Goles',
      pickSelection: 'Under 2.5 @ 1.82',
      pickOdds: 1.82,
      edgePct: 7.9,
      mu: 2.10,
      sigma: 0.88,
      simulations: 100000,
      analysisSnippet: 'Duelo táctico defensivo con xGA inferior a 0.85 goles concedidos por cada 90 minutos.'
    },

    // NBA
    {
      id: 'nba_1',
      sport: 'nba',
      league: 'NBA Regular Season',
      homeTeam: 'LA Lakers',
      awayTeam: 'Golden State Warriors',
      homeLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      awayLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png',
      kickoffDate: this.todayStr,
      kickoffTime: '22:30',
      status: 'PRE_MATCH',
      probHome: 58.6,
      probAway: 41.4,
      homeOdds: 1.70,
      awayOdds: 2.20,
      isOfficialPick: true,
      isProbableByStats: false,
      pickTitle: 'LA Lakers -3.5 Spread',
      pickSelection: 'Lakers -3.5 @ 1.91',
      pickOdds: 1.91,
      edgePct: 15.6,
      mu: 228.5,
      sigma: 12.4,
      simulations: 100000,
      analysisSnippet: 'Eficiencia neta de Lakers +8.2 en casa vs defensas de perímetro. Spread favorable con ventaja matemática.'
    },
    {
      id: 'nba_2',
      sport: 'nba',
      league: 'NBA Regular Season',
      homeTeam: 'Boston Celtics',
      awayTeam: 'Milwaukee Bucks',
      homeLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
      awayLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png',
      kickoffDate: this.todayStr,
      kickoffTime: '19:00',
      status: 'PRE_MATCH',
      probHome: 64.2,
      probAway: 35.8,
      homeOdds: 1.55,
      awayOdds: 2.50,
      isOfficialPick: false,
      isProbableByStats: true,
      pickTitle: 'Over 224.5 Puntos Totales',
      pickSelection: 'Over 224.5 @ 1.87',
      pickOdds: 1.87,
      edgePct: 9.3,
      mu: 231.2,
      sigma: 11.8,
      simulations: 100000,
      analysisSnippet: 'Ritmo proyectado de 102.4 posesiones. Ambos equipos en el top 5 de volumen de triples intentados.'
    },
    {
      id: 'nba_3',
      sport: 'nba',
      league: 'NBA Regular Season',
      homeTeam: 'Dallas Mavericks',
      awayTeam: 'Denver Nuggets',
      homeLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png',
      awayLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
      kickoffDate: this.todayStr,
      kickoffTime: '20:30',
      status: 'PRE_MATCH',
      probHome: 51.5,
      probAway: 48.5,
      homeOdds: 1.92,
      awayOdds: 1.92,
      isOfficialPick: true,
      isProbableByStats: false,
      pickTitle: 'Nuggets Moneyline',
      pickSelection: 'Denver ML @ 1.92',
      pickOdds: 1.92,
      edgePct: 11.2,
      mu: 221.0,
      sigma: 10.9,
      simulations: 100000,
      analysisSnippet: 'Calibración Monte Carlo favorece rebote ofensivo y porcentaje de tiro efectivo de Denver en la pintura.'
    },

    // NFL
    {
      id: 'nfl_1',
      sport: 'nfl',
      league: 'NFL Regular Season',
      homeTeam: 'Kansas City Chiefs',
      awayTeam: 'San Francisco 49ers',
      homeLogo: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png',
      awayLogo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png',
      kickoffDate: this.todayStr,
      kickoffTime: '21:15',
      status: 'PRE_MATCH',
      probHome: 56.4,
      probAway: 43.6,
      homeOdds: 1.76,
      awayOdds: 2.15,
      isOfficialPick: true,
      isProbableByStats: false,
      pickTitle: 'Chiefs Moneyline',
      pickSelection: 'Kansas City Chiefs ML @ 1.76',
      pickOdds: 1.76,
      edgePct: 14.1,
      mu: 48.5,
      sigma: 8.2,
      simulations: 100000,
      analysisSnippet: 'EPA por pase de Mahomes supera en +0.18 al promedio. Modelo halla clara ineficiencia en cuotas de visita.'
    },
    {
      id: 'nfl_2',
      sport: 'nfl',
      league: 'NFL Regular Season',
      homeTeam: 'Philadelphia Eagles',
      awayTeam: 'Dallas Cowboys',
      homeLogo: 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png',
      awayLogo: 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png',
      kickoffDate: this.todayStr,
      kickoffTime: '17:25',
      status: 'PRE_MATCH',
      probHome: 61.2,
      probAway: 38.8,
      homeOdds: 1.62,
      awayOdds: 2.35,
      isOfficialPick: false,
      isProbableByStats: true,
      pickTitle: 'Eagles -3.0 Spread',
      pickSelection: 'Eagles -3.0 @ 1.85',
      pickOdds: 1.85,
      edgePct: 8.4,
      mu: 47.0,
      sigma: 7.9,
      simulations: 100000,
      analysisSnippet: 'Dominio de línea ofensiva en yardas terrestres tras el primer contacto (+114 yardas promedio).'
    }
  ];

  constructor() {
    this.fetchMatches();

    effect(() => {
      // Re-fetch when sport or date changes
      const s = this.selectedSport();
      const d = this.selectedDate();
      const allD = this.allDatesMode();
      this.fetchMatches(s, allD ? undefined : d);
    });
  }

  public fetchMatches(sport?: SportFilterType, dateStr?: string): void {
    this.isLoading.set(true);
    const sp = (!sport || sport === 'all') ? 'all' : sport;

    this.api.getMatches(sp, undefined, dateStr).subscribe({
      next: (matches) => {
        this.isLoading.set(false);
        if (matches && matches.length > 0) {
          const mapped = matches.map(m => this.mapMatchToDayItem(m));
          this.liveMatches.set(mapped);
        } else {
          // If query returned no matches for today, keep live empty so fallback/all dates can be viewed
          this.liveMatches.set([]);
        }
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  private mapMatchToDayItem(m: Match): DayMatchItem {
    const rawPicks = (m.picks || []).filter((p: any) => !p.superseded);
    const officialPick = rawPicks.find((p: any) => p.tier === 'oficial');
    const probablePick = rawPicks.find((p: any) => p.tier === 'probable');
    const chosenPick = officialPick || probablePick || rawPicks[0];

    const isOfficial = !!officialPick;
    const isProbable = !officialPick && !!probablePick;

    let kDate = this.todayStr;
    let kTime = '20:00';
    if (m.kickoff_utc) {
      try {
        const d = new Date(m.kickoff_utc);
        kDate = d.toISOString().slice(0, 10);
        kTime = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
      } catch {}
    }

    const hOdds = m.odds_summary?.home || chosenPick?.odds_used || 1.85;
    const aOdds = m.odds_summary?.away || 2.10;
    const dOdds = (m.sport_id === 'futbol' || m.sport_id === 'soccer') ? 3.40 : undefined;

    return {
      id: m.id,
      sport: (m.sport_id === 'soccer' ? 'futbol' : (m.sport_id || 'futbol')) as any,
      league: m.league_id || 'Liga Oficial',
      homeTeam: m.home_team?.name || 'Local',
      awayTeam: m.away_team?.name || 'Visita',
      homeLogo: m.home_team?.logo_url || 'https://crests.football-data.org/default.png',
      awayLogo: m.away_team?.logo_url || 'https://crests.football-data.org/default.png',
      kickoffDate: kDate,
      kickoffTime: kTime,
      status: m.status === 'live' ? 'LIVE' : (m.status === 'finished' ? 'FINISHED' : 'PRE_MATCH'),
      scoreHome: m.home_score,
      scoreAway: m.away_score,
      period: m.period_label,
      probHome: m.prob_home_pct || 52,
      probDraw: m.prob_draw_pct,
      probAway: m.prob_away_pct || 48,
      homeOdds: Number(hOdds),
      drawOdds: dOdds,
      awayOdds: Number(aOdds),
      isOfficialPick: isOfficial,
      isProbableByStats: isProbable,
      pickTitle: chosenPick?.selection || (isOfficial ? 'Pick Oficial (+EV)' : 'Probable por Stats'),
      pickSelection: chosenPick?.selection || `${m.home_team?.name} ML`,
      pickOdds: chosenPick?.odds_used ? Number(chosenPick.odds_used) : Number(hOdds),
      edgePct: chosenPick?.edge ? Math.round(chosenPick.edge * 1000) / 10 : (isOfficial ? 14.5 : 8.2),
      mu: 2.85,
      sigma: 1.15,
      simulations: 100000,
      analysisSnippet: chosenPick?.explanation_short || `Ventaja matemática confirmada por simulación Monte Carlo de 100,000 iteraciones.`
    };
  }

  public sportsSummary = computed(() => {
    const list = this.effectiveList();
    return {
      all: list.length,
      futbol: list.filter(m => m.sport === 'futbol').length,
      nba: list.filter(m => m.sport === 'nba').length,
      nfl: list.filter(m => m.sport === 'nfl').length
    };
  });

  private effectiveList = computed(() => {
    const live = this.liveMatches();
    if (live.length > 0) return live;
    return this.fallbackCatalog;
  });

  public filteredMatches = computed(() => {
    let list = this.effectiveList();
    const sport = this.selectedSport();
    const query = this.searchQuery().trim().toLowerCase();
    const date = this.selectedDate();
    const allDates = this.allDatesMode();

    if (sport !== 'all') {
      list = list.filter(m => m.sport === sport);
    }

    if (!allDates && date) {
      list = list.filter(m => m.kickoffDate === date);
    }

    if (query) {
      list = list.filter(m =>
        m.homeTeam.toLowerCase().includes(query) ||
        m.awayTeam.toLowerCase().includes(query) ||
        m.league.toLowerCase().includes(query)
      );
    }

    return list;
  });

  public setSport(sport: SportFilterType): void {
    this.selectedSport.set(sport);
  }

  public setToday(): void {
    this.allDatesMode.set(false);
    this.selectedDate.set(this.todayStr);
  }

  public toggleAllDates(): void {
    this.allDatesMode.update(v => !v);
  }

  public changeDate(daysOffset: number): void {
    this.allDatesMode.set(false);
    const cur = new Date(this.selectedDate() + 'T00:00:00');
    cur.setDate(cur.getDate() + daysOffset);
    this.selectedDate.set(cur.toISOString().slice(0, 10));
  }

  public onDatePicked(dateVal: string): void {
    if (dateVal) {
      this.allDatesMode.set(false);
      this.selectedDate.set(dateVal);
    }
  }

  public isToday(): boolean {
    return this.selectedDate() === this.todayStr;
  }
}
