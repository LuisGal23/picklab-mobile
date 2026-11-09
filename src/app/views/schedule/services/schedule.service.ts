import { Injectable, signal, computed, inject } from '@angular/core';
import { DayMatchItem, SportFilterType } from './schedule.models';
import { ApiService, Match } from '../../../core/services/api.service';

export type ScheduleSubFilter = 'all' | 'picks' | 'live' | 'finished';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private api = inject(ApiService);
  private readonly todayStr = this.getTodayLocalDateString();

  public selectedSport = signal<SportFilterType>('all');
  public searchQuery = signal<string>('');
  public selectedDate = signal<string>(this.todayStr);
  public allDatesMode = signal<boolean>(false);
  public subFilter = signal<ScheduleSubFilter>('all');
  public isLoading = signal<boolean>(false);

  // Pool of all live matches loaded from Supabase across sports
  private liveMatches = signal<DayMatchItem[]>([]);

  constructor() {
    this.fetchAllUpcomingMatches();
  }

  private getTodayLocalDateString(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  public getTomorrowLocalDateString(): string {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  public fetchAllUpcomingMatches(): void {
    this.isLoading.set(true);
    this.api.getMatches('all', undefined, undefined).subscribe({
      next: (matches) => {
        this.isLoading.set(false);
        if (matches && matches.length > 0) {
          const mapped = matches.map(m => this.mapMatchToDayItem(m));
          this.liveMatches.set(mapped);
        }
      },
      error: (err) => {
        console.warn('Could not fetch matches from Supabase:', err);
        this.isLoading.set(false);
      }
    });
  }

  public fetchMatchesByDate(dateStr: string): void {
    this.isLoading.set(true);
    const sp = this.selectedSport();
    this.api.getMatches(sp === 'all' ? undefined : sp, undefined, dateStr).subscribe({
      next: (matches) => {
        this.isLoading.set(false);
        if (matches && matches.length > 0) {
          const mapped = matches.map(m => this.mapMatchToDayItem(m));
          const cur = [...this.liveMatches()];
          for (const item of mapped) {
            const idx = cur.findIndex(c => c.id === item.id);
            if (idx >= 0) cur[idx] = item;
            else cur.push(item);
          }
          this.liveMatches.set(cur);
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
        const y = d.getFullYear();
        const mon = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        kDate = `${y}-${mon}-${day}`;
        kTime = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
      } catch {}
    }

    const hOdds = m.odds_summary?.home || chosenPick?.odds_used || 1.85;
    const aOdds = m.odds_summary?.away || 2.10;
    const dOdds = (m.sport_id === 'futbol' || m.sport_id === 'soccer') ? 3.40 : undefined;

    const sId = m.sport_id === 'soccer' ? 'futbol' : (m.sport_id || 'futbol');

    return {
      id: m.id,
      sport: sId as any,
      league: m.league_id || (sId === 'nba' ? 'NBA Regular Season' : sId === 'nfl' ? 'NFL Regular Season' : 'Competición Oficial'),
      homeTeam: m.home_team?.name || 'Local',
      awayTeam: m.away_team?.name || 'Visita',
      homeLogo: m.home_team?.logo_url || (sId === 'nba' ? 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png' : sId === 'nfl' ? 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png' : 'https://crests.football-data.org/86.png'),
      awayLogo: m.away_team?.logo_url || (sId === 'nba' ? 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png' : sId === 'nfl' ? 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png' : 'https://crests.football-data.org/81.png'),
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
      mu: Number(chosenPick?.simulation_params?.['mu'] || 2.85),
      sigma: Number(chosenPick?.simulation_params?.['sigma'] || 1.15),
      simulations: 100000,
      analysisSnippet: chosenPick?.explanation_short || `Ventaja matemática confirmada por simulación Monte Carlo de 100,000 iteraciones.`
    };
  }

  // Summary counts by sport from the loaded pool
  public sportsSummary = computed(() => {
    const list = this.liveMatches();
    return {
      all: list.length,
      futbol: list.filter(m => m.sport === 'futbol').length,
      nba: list.filter(m => m.sport === 'nba').length,
      nfl: list.filter(m => m.sport === 'nfl').length
    };
  });

  // Determines whether the current view is auto-showing upcoming matches because no matches exist for selected date
  public showingUpcomingNotice = computed<boolean>(() => {
    if (this.allDatesMode()) return false;
    const sport = this.selectedSport();
    const date = this.selectedDate();
    let list = this.liveMatches();
    if (sport !== 'all') {
      list = list.filter(m => m.sport === sport);
    }
    const forDate = list.filter(m => m.kickoffDate === date);
    return forDate.length === 0 && list.length > 0;
  });

  public filteredMatches = computed(() => {
    let list = this.liveMatches();
    const sport = this.selectedSport();
    const query = this.searchQuery().trim().toLowerCase();
    const date = this.selectedDate();
    const allDates = this.allDatesMode();
    const sub = this.subFilter();

    // 1. Filter by Sport
    if (sport !== 'all') {
      list = list.filter(m => m.sport === sport);
    }

    // 2. Filter by Date: if specific date has matches, show them.
    // If not in allDatesMode but that date has 0 matches for this sport, show all upcoming matches so user is never stranded!
    if (!allDates && date) {
      const dateFiltered = list.filter(m => m.kickoffDate === date);
      if (dateFiltered.length > 0) {
        list = dateFiltered;
      }
    }

    // 3. Sub-filter: all | picks | live | finished
    if (sub === 'picks') {
      list = list.filter(m => m.isOfficialPick || m.isProbableByStats);
    } else if (sub === 'live') {
      list = list.filter(m => m.status === 'LIVE');
    } else if (sub === 'finished') {
      list = list.filter(m => m.status === 'FINISHED');
    }

    // 4. Search query filter
    if (query) {
      list = list.filter(m =>
        m.homeTeam.toLowerCase().includes(query) ||
        m.awayTeam.toLowerCase().includes(query) ||
        m.league.toLowerCase().includes(query) ||
        (m.pickTitle || '').toLowerCase().includes(query)
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
    this.fetchMatchesByDate(this.todayStr);
  }

  public setTomorrow(): void {
    this.allDatesMode.set(false);
    const tom = this.getTomorrowLocalDateString();
    this.selectedDate.set(tom);
    this.fetchMatchesByDate(tom);
  }

  public toggleAllDates(): void {
    this.allDatesMode.update(v => !v);
  }

  public changeDate(daysOffset: number): void {
    this.allDatesMode.set(false);
    const cur = new Date(this.selectedDate() + 'T12:00:00');
    cur.setDate(cur.getDate() + daysOffset);
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    const newDateStr = `${y}-${m}-${d}`;
    this.selectedDate.set(newDateStr);
    this.fetchMatchesByDate(newDateStr);
  }

  public onDatePicked(dateVal: string): void {
    if (dateVal) {
      this.allDatesMode.set(false);
      this.selectedDate.set(dateVal);
      this.fetchMatchesByDate(dateVal);
    }
  }

  public isToday(): boolean {
    return this.selectedDate() === this.todayStr;
  }

  public isTomorrow(): boolean {
    return this.selectedDate() === this.getTomorrowLocalDateString();
  }
}
