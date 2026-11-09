import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, from, tap, shareReplay, catchError } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { environment } from '../../../environments/environment';

export interface Sport {
  id: string;
  name: string;
  icon: string;
}

export interface League {
  id: string;
  sport_id: string;
  name: string;
  country?: string;
  logo_url?: string;
}

export interface Match {
  id: string;
  sport_id: string;
  league_id: string;
  kickoff_utc: string;
  status: string;
  home_team_id?: string;
  away_team_id?: string;
  home_team: any;
  away_team: any;
  home_score?: number;
  away_score?: number;
  period_label?: string;
  prob_home_pct?: number;
  prob_away_pct?: number;
  prob_draw_pct?: number;
  model_version?: string;
  model_favorite?: string;
  model_favorite_prob?: number;
  value_pick?: any;
  picks?: any[];
  simulations?: any[];
  odds_summary?: any;
}

export interface SoccerStats {
  shots?: number;
  shots_on_target?: number;
  corners?: number;
  fouls?: number;
  yellow_cards?: number;
  red_cards?: number;
  possession_pct?: number;
  saves?: number;
  offsides?: number;
}

export interface TeamMatchStatsItem {
  team_id?: string;
  is_home?: boolean;
  soccer?: SoccerStats;
  stats?: Record<string, any>;
  raw_stats?: Record<string, any>;
}

export interface PlayerMatchStatsItem {
  player_id: string;
  player_name: string;
  team_id: string;
  jersey?: string;
  position?: string;
  starter?: boolean;
  minutes?: number | string;
  stats?: Record<string, any>;
  has_match_stats?: boolean;
  photo_url?: string;
  player?: any;
}

export interface OddsQuoteItem {
  bookmaker: string;
  market: string;
  selection: string;
  line?: number;
  odds_decimal: number;
}

export interface RecentFormGame {
  id: string;
  date: string;
  score: string;
  result: string; // "W", "D", "L"
  opponent_name: string;
  opponent?: string;
  opponent_id?: string;
  opponent_logo?: string;
  is_home: boolean;
  score_display?: string;
  team_stats?: any;
  opponent_stats?: any;
  league_id?: string;
  competition?: string;
}

export interface TeamRecentForm {
  team_id: string;
  team_name: string;
  games: RecentFormGame[];
}

export interface H2HMatch {
  id: string;
  date: string;
  home_team_name: string;
  away_team_name: string;
  home_score: number;
  away_score: number;
  competition?: string;
  league_name?: string;
  league_id?: string;
  home_team_id?: string;
  away_team_id?: string;
  home_team_logo?: string;
  away_team_logo?: string;
  home_stats?: any;
  away_stats?: any;
}

export interface ParlayLeg {
  id: string;
  match_id: string;
  sport: string;
  home_team: string;
  away_team: string;
  home_logo?: string;
  away_logo?: string;
  kickoff_utc: string;
  market: string;
  selection: string;
  line?: number | null;
  odds: number;
  prob_model: number;
  edge: number;
  confidence: string;
  content_hash?: string;
  created_at?: string;
}

export interface ParlayItem {
  title: string;
  badge: string;
  risk_level: string;
  description: string;
  legs_count: number;
  combined_odds: number;
  combined_prob_pct: number;
  expected_value_pct: number;
  payout_100_units: number;
  payout_10_units: number;
  legs: ParlayLeg[];
}

export interface ParlaysResponse {
  safe_parlay: ParlayItem | null;
  dream_parlay: ParlayItem | null;
  value_parlay: ParlayItem | null;
  official_picks: ParlayLeg[];
}

export interface H2HSummary {
  summary_text?: string;
  home_wins: number;
  away_wins: number;
  draws: number;
  matches: H2HMatch[];
}

export interface MatchDetailResponse {
  match: Match;
  team_stats: (TeamMatchStatsItem | null)[];
  player_stats: PlayerMatchStatsItem[];
  odds: OddsQuoteItem[];
  recent_form?: TeamRecentForm[];
  h2h?: H2HSummary;
  picks?: PickItem[];
  simulations?: any[];
  is_partial?: boolean;
  partial?: boolean;
}

export interface PickItem {
  id: string;
  match_id: string;
  market: string;
  selection: string;
  line?: number;
  odds_used: number;
  prob_model: number;
  prob_implied: number;
  edge: number;
  confidence: string;
  content_hash: string;
  model_version_id: string;
  model_version?: string;
  sport?: string;
  closing_odds?: number;
  simulation_params?: Record<string, any>;
  status?: string;
  created_at: string;
  match?: Match;
  result?: any;
  tier?: string;
  support_stat?: string;
}

export interface CalibrationBin {
  bin_label: string;
  predicted_avg: number;
  actual_win_rate: number;
  sample_size: number;
}

export interface MarketBreakdown {
  market: string;
  sample_size: number;
  won: number;
  lost: number;
  win_rate: number;
  roi: number;
  profit_units: number;
}

export interface EdgeBreakdown {
  edge_range: string;
  sample_size: number;
  won: number;
  lost: number;
  win_rate: number;
  roi: number;
  profit_units: number;
}

export interface LeagueBreakdown {
  league_id: string;
  sample_size: number;
  won: number;
  lost: number;
  win_rate: number;
  roi: number;
  profit_units: number;
}

export interface AuditedPickItem {
  id: string;
  pick_id: string;
  result: string;
  market: string;
  selection: string;
  line?: number;
  odds_used: number;
  prob_model?: number;
  prob_implied?: number;
  edge: number;
  confidence: string;
  content_hash: string;
  evaluated_at: string;
  created_at?: string;
  sport_id?: string;
  home_team_name: string;
  away_team_name: string;
  home_team_logo?: string;
  away_team_logo?: string;
  home_score?: number;
  away_score?: number;
  actual_outcome?: any;
  tier?: string;
  is_suspicious?: boolean;
}

export interface TierPerformance {
  tier_id: 'oficial' | 'probable' | 'sospechoso';
  label: string;
  total_evaluated: number;
  won: number;
  lost: number;
  push: number;
  win_rate: number;
  roi: number;
  total_profit_units: number;
}

export interface SportBreakdown {
  sport_id: string;
  sample_size: number;
  won: number;
  lost: number;
  push: number;
  void: number;
  win_rate: number;
  roi: number;
  profit_units: number;
}

export interface AuditSummary {
  total_evaluated: number;
  won: number;
  lost: number;
  push: number;
  void: number;
  win_rate: number;
  roi: number;
  total_profit_units: number;
  brier_score: number;
  log_loss: number;
  clv_avg: number;
  calibration_curve: CalibrationBin[];
  breakdown_by_market: MarketBreakdown[];
  breakdown_by_edge: EdgeBreakdown[];
  breakdown_by_league: LeagueBreakdown[];
  breakdown_by_sport?: SportBreakdown[];
  recent_picks: AuditedPickItem[];
  selected_tier?: string;
  tier_summaries?: {
    oficial: TierPerformance;
    probable: TierPerformance;
    sospechoso: TierPerformance;
  };
  probable_summary?: {
    total_evaluated: number;
    won: number;
    lost: number;
    push: number;
    win_rate: number;
  };
}

export interface PlayerBio {
  id: string;
  sport_id: string;
  team_id?: string;
  name: string;
  jersey?: string;
  position?: string;
  photo_url?: string;
  team?: any;
  created_at?: string;
}

export interface PlayerSummaryKPIs {
  games_played: number;
  primary_label: string;
  primary_val: number;
  secondary_label: string;
  secondary_val: number;
  tertiary_label: string;
  tertiary_val: number;
  minutes_avg?: number;
  top_performance?: number;
}

export interface PlayerRecentMatch {
  match_id: string;
  date?: string;
  opponent: string;
  score: string;
  minutes?: number;
  stats_display: string;
  raw_stats?: Record<string, any>;
}

export interface PlayerChartData {
  labels: string[];
  primary_values: number[];
  secondary_values: number[];
  primary_label: string;
  secondary_label: string;
  primary_color: string;
  secondary_color: string;
  radar_labels: string[];
  radar_values: number[];
}

export interface PlayerProfileResponse {
  player: PlayerBio;
  team?: any;
  summary: PlayerSummaryKPIs;
  recent_matches: PlayerRecentMatch[];
  chart: PlayerChartData;
}

export interface PlayerMarketItem {
  id: string;
  label: string;
  key: string;
  column: string;
}

export interface PlayerGamelogRow {
  date: string;
  opponent_display: string;
  opponent_logo?: string;
  result: 'G' | 'P' | 'E';
  score: string;
  minutes: number | string;
  stats: Record<string, any>;
}

export interface PlayerGamelogResponse {
  player: PlayerBio;
  team?: any;
  sport: string;
  markets: PlayerMarketItem[];
  gamelog: PlayerGamelogRow[];
  averages_last_10: Record<string, number>;
  averages_last_5: Record<string, number>;
  season_totals: Record<string, number>;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private supabase = inject(SupabaseService);
  private base = environment.apiUrl;
  private matchDetailCache = new Map<string, { data: MatchDetailResponse; timestamp: number }>();

  getSports(): Observable<Sport[]> {
    if (!this.base) {
      return of([
        { id: 'futbol', name: 'Fútbol', icon: '⚽' },
        { id: 'nba', name: 'Baloncesto', icon: '🏀' },
        { id: 'nfl', name: 'Fútbol Americano', icon: '🏈' },
        { id: 'mlb', name: 'Béisbol', icon: '⚾' }
      ]);
    }
    return this.http.get<Sport[]>(`${this.base}/sports`).pipe(
      catchError(err => {
        console.warn('API /sports failed, falling back to static/supabase:', err);
        return of([
          { id: 'futbol', name: 'Fútbol', icon: '⚽' },
          { id: 'nba', name: 'Baloncesto', icon: '🏀' },
          { id: 'nfl', name: 'Fútbol Americano', icon: '🏈' },
          { id: 'mlb', name: 'Béisbol', icon: '⚾' }
        ]);
      })
    );
  }

  getLeagues(sport?: string): Observable<League[]> {
    if (!this.base) {
      return from(this.fetchLeaguesDirectFromSupabase(sport));
    }
    let params = new HttpParams();
    if (sport) params = params.set('sport', sport);
    return this.http.get<League[]>(`${this.base}/leagues`, { params }).pipe(
      catchError(err => {
        console.warn('API /leagues failed, falling back to Supabase:', err);
        return from(this.fetchLeaguesDirectFromSupabase(sport));
      })
    );
  }

  getMatches(sport?: string, league?: string, dateStr?: string): Observable<Match[]> {
    if (!this.base) {
      return from(this.fetchMatchesDirectFromSupabase(sport, league, dateStr)).pipe(
        catchError(err => {
          console.error('fetchMatchesDirectFromSupabase error:', err);
          return of([]);
        })
      );
    }
    let params = new HttpParams();
    if (sport) params = params.set('sport', sport);
    if (league) params = params.set('league', league);
    if (dateStr) params = params.set('date', dateStr);
    return this.http.get<Match[]>(`${this.base}/matches`, { params }).pipe(
      catchError(err => {
        console.warn('API /matches failed, falling back to direct Supabase query:', err);
        return from(this.fetchMatchesDirectFromSupabase(sport, league, dateStr));
      })
    );
  }

  private prefetchQueue = new Set<string>();
  private isPrefetching = false;

  prefetchMatchDetail(matchId: string, sport?: string, league?: string): void {
    if (!matchId) return;
    const cached = this.matchDetailCache.get(matchId);
    const now = Date.now();
    // Don't refetch if cached within the last 45 seconds
    if (cached && (now - cached.timestamp < 45000)) return;
    if (this.prefetchQueue.has(matchId) || this.isPrefetching) return;

    this.prefetchQueue.add(matchId);
    this.isPrefetching = true;

    this.getMatchDetail(matchId, sport, league).subscribe({
      next: () => {
        this.isPrefetching = false;
        this.prefetchQueue.delete(matchId);
      },
      error: () => {
        this.isPrefetching = false;
        this.prefetchQueue.delete(matchId);
      }
    });
  }

  getMatchDetail(matchId: string, sport?: string, league?: string, forceRefresh: boolean = false): Observable<MatchDetailResponse> {
    if (forceRefresh) {
      this.matchDetailCache.delete(matchId);
    }
    let params = new HttpParams();
    if (sport) params = params.set('sport', sport);
    if (league) params = params.set('league', league);

    const cached = this.matchDetailCache.get(matchId);
    const now = Date.now();
    const CACHE_TTL_MS = 30000; // 30s freshness window

    // If cache is fresh (< 30s) and not partial, return cached immediately
    if (cached && (now - cached.timestamp < CACHE_TTL_MS) && !cached.data.partial && !cached.data.is_partial) {
      return of(cached.data);
    }

    if (!this.base) {
      const direct$ = from(this.fetchMatchDetailDirectFromSupabase(matchId, sport, league)).pipe(
        tap(data => this.matchDetailCache.set(matchId, { data, timestamp: Date.now() })),
        shareReplay(1)
      );
      if (cached) {
        direct$.subscribe({ next: () => {}, error: () => {} });
        return of(cached.data);
      }
      return direct$;
    }

    const fetch$ = this.http.get<MatchDetailResponse>(`${this.base}/matches/${matchId}`, { params }).pipe(
      catchError(err => {
        console.warn(`API /matches/${matchId} failed, falling back to direct Supabase:`, err);
        return from(this.fetchMatchDetailDirectFromSupabase(matchId, sport, league));
      }),
      tap(data => {
        this.matchDetailCache.set(matchId, { data, timestamp: Date.now() });
      }),
      shareReplay(1)
    );

    // If cached but slightly stale or partial, return cached immediately and revalidate in background
    if (cached) {
      fetch$.subscribe({ next: () => {}, error: () => {} });
      return of(cached.data);
    }

    return fetch$;
  }

  getPicks(sport?: string, confidence?: string, minEdge?: number): Observable<PickItem[]> {
    if (!this.base) {
      return from(this.fetchPicksDirectFromSupabase(sport, confidence, minEdge));
    }
    let params = new HttpParams();
    if (sport) params = params.set('sport', sport);
    if (confidence) params = params.set('confidence', confidence);
    if (minEdge !== undefined) params = params.set('min_edge', minEdge.toString());
    return this.http.get<PickItem[]>(`${this.base}/picks`, { params }).pipe(
      catchError(err => {
        console.warn('API /picks failed, falling back to direct Supabase:', err);
        return from(this.fetchPicksDirectFromSupabase(sport, confidence, minEdge));
      })
    );
  }

  getAuditSummary(sport?: string, league?: string, market?: string, minEdge?: number, date?: string, month?: string, tier: string = 'oficial'): Observable<AuditSummary> {
    if (!this.base) {
      return from(this.fetchAuditSummaryDirectFromSupabase(sport, league, market, minEdge, date, month, tier));
    }
    let params = new HttpParams();
    if (sport) params = params.set('sport', sport);
    if (league) params = params.set('league', league);
    if (market) params = params.set('market', market);
    if (minEdge !== undefined) params = params.set('min_edge', minEdge.toString());
    if (date) params = params.set('date', date);
    if (month) params = params.set('month', month);
    if (tier) params = params.set('tier', tier);
    return this.http.get<AuditSummary>(`${this.base}/audit/summary`, { params }).pipe(
      catchError(err => {
        console.warn('API /audit/summary failed, falling back to direct Supabase:', err);
        return from(this.fetchAuditSummaryDirectFromSupabase(sport, league, market, minEdge, date, month, tier));
      })
    );
  }

  getPlayerProfile(playerId: string): Observable<PlayerProfileResponse> {
    if (!this.base) {
      return from(this.fetchPlayerProfileDirectFromSupabase(playerId));
    }
    return this.http.get<PlayerProfileResponse>(`${this.base}/players/${playerId}`).pipe(
      catchError(() => from(this.fetchPlayerProfileDirectFromSupabase(playerId)))
    );
  }

  getPlayerGamelog(playerId: string, matchId?: string): Observable<PlayerGamelogResponse> {
    if (!this.base) {
      return from(this.fetchPlayerGamelogDirectFromSupabase(playerId, matchId));
    }
    let params = new HttpParams();
    if (matchId) params = params.set('match_id', matchId);
    return this.http.get<PlayerGamelogResponse>(`${this.base}/players/${playerId}/gamelog`, { params }).pipe(
      catchError(() => from(this.fetchPlayerGamelogDirectFromSupabase(playerId, matchId)))
    );
  }

  getPlayers(sport?: string, search?: string, limit: number = 25): Observable<PlayerBio[]> {
    if (!this.base) {
      return from(this.fetchPlayersDirectFromSupabase(sport, search, limit));
    }
    let params = new HttpParams().set('limit', limit.toString());
    if (sport) params = params.set('sport', sport);
    if (search) params = params.set('search', search);
    return this.http.get<PlayerBio[]>(`${this.base}/players`, { params }).pipe(
      catchError(() => from(this.fetchPlayersDirectFromSupabase(sport, search, limit)))
    );
  }

  private async fetchPlayersDirectFromSupabase(sport?: string, search?: string, limit: number = 25): Promise<PlayerBio[]> {
    await this.supabase.ensureReady();
    const client = this.supabase.getClient();
    if (!client) return [];
    try {
      let query = client
        .from('players')
        .select('*, team:teams!team_id(id, name, short_name, abbreviation, logo_url)')
        .order('name', { ascending: true })
        .limit(limit);
      if (sport && sport.toLowerCase() !== 'all') {
        query = query.eq('sport_id', sport);
      }
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      const { data, error } = await query;
      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  }

  getParlays(sport?: string, date?: string): Observable<ParlaysResponse> {
    if (!this.base) {
      return from(this.fetchParlaysDirectFromSupabase(sport, date));
    }
    let params = new HttpParams();
    if (sport) params = params.set('sport', sport);
    if (date) params = params.set('date', date);
    return this.http.get<ParlaysResponse>(`${this.base}/picks/parlays`, { params }).pipe(
      catchError(err => {
        console.warn('API /picks/parlays failed, falling back to direct Supabase:', err);
        return from(this.fetchParlaysDirectFromSupabase(sport, date));
      })
    );
  }

  syncAndAudit(): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(`${this.base}/audit/sync-and-audit`, {});
  }

  private async fetchMatchesDirectFromSupabase(sport?: string, league?: string, dateStr?: string): Promise<Match[]> {
    await this.supabase.ensureReady();
    const client = this.supabase.getClient();
    if (!client) return [];

    try {
      let query = client
        .from('matches')
        .select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*), picks(id,created_at,market,selection,line,edge,confidence,odds_used,prob_model,prob_implied,content_hash,simulation_params,model_version,sport,closing_odds,tier,support_stat,sample_size,explanation_short,superseded:pick_supersessions!old_pick_id(id),results:pick_results(result,actual_outcome)), simulations:simulation_runs(summary_metrics,created_at)')
        .order('kickoff_utc', { ascending: true })
        .limit(200);

      if (sport && sport.toLowerCase() !== 'all') {
        query = query.eq('sport_id', sport);
      }
      if (league) {
        query = query.eq('league_id', league);
      }
      if (dateStr) {
        try {
          const [y, m, d] = dateStr.split('-').map(Number);
          const nextD = new Date(Date.UTC(y, m - 1, d + 1));
          const nextStr = nextD.toISOString().split('T')[0];
          query = query.gte('kickoff_utc', `${dateStr}T00:00:00Z`).lte('kickoff_utc', `${nextStr}T08:00:00Z`);
        } catch {
          query = query.gte('kickoff_utc', `${dateStr}T00:00:00Z`).lte('kickoff_utc', `${dateStr}T23:59:59Z`);
        }
      } else {
        // Prevent Postgres statement timeout scanning 17k historical matches
        const recentWindow = new Date(Date.now() - 3 * 86400000).toISOString();
        query = query.gte('kickoff_utc', recentWindow).limit(100);
      }

      const timeoutPromise = new Promise<{ data: any; error: any }>((_, reject) =>
        setTimeout(() => reject(new Error('Matches query timeout')), 18000)
      );
      const res = await Promise.race([query, timeoutPromise]) as any;
      const data = res?.data;
      const error = res?.error;
      if (error || !data) {
        console.warn('Supabase direct query notice:', error?.message);
        return [];
      }

      return data.map((r: any) => this.formatMatchRecord(r));
    } catch (e) {
      console.error('Direct fetch error:', e);
      return [];
    }
  }

  private formatMatchRecord(r: any): Match {
    const sims = r.simulations || [];
    const sortedSims = [...sims].sort((a: any, b: any) => (b.created_at || '').localeCompare(a.created_at || ''));
    const metrics = sortedSims[0]?.summary_metrics || {};

    let probHome = metrics.prob_home_win ?? null;
    let probAway = metrics.prob_away_win ?? null;
    let probDraw = metrics.prob_draw ?? null;

    if (probHome == null || probAway == null) {
      const picks = r.picks || [];
      for (const p of picks) {
        const sp = p.simulation_params || {};
        if (sp.model_favorite && sp.model_favorite_prob) {
          const fav = String(sp.model_favorite).toLowerCase();
          const pVal = Number(sp.model_favorite_prob);
          if (fav === 'home') {
            probHome = pVal;
            probAway = 1 - pVal;
          } else if (fav === 'away') {
            probAway = pVal;
            probHome = 1 - pVal;
          }
          break;
        }
      }
      if (probHome == null) {
        probHome = 0.52;
        probAway = 0.48;
      }
    }

    const isSoccer = r.sport_id === 'futbol' || r.sport_id === 'soccer';
    let probDrawPct: number | undefined = undefined;
    if (isSoccer) {
      if (probDraw == null) {
        probDraw = Math.max(0.18, +(1.0 - (probHome || 0.44) - (probAway || 0.32)).toFixed(4));
      }
      probDrawPct = Math.round(probDraw * 100);
    }
    const probHomePct = Math.round((probHome ?? (isSoccer ? 0.44 : 0.52)) * 100);
    const probAwayPct = Math.round((probAway ?? (1 - (probHome ?? 0.52) - (probDraw ?? 0))) * 100);

    // Odds summary (read from picks first, fallback to simulation implied odds)
    let hOdds: number | null = null;
    let aOdds: number | null = null;
    let totLine: number | null = null;

    for (const p of r.picks || []) {
      if (p.odds_used) {
        const sel = (p.selection || '').toLowerCase();
        if (sel === 'home' && !hOdds) hOdds = p.odds_used;
        else if (sel === 'away' && !aOdds) aOdds = p.odds_used;
        if (p.line != null && !totLine) totLine = p.line;
      }
    }

    const oddsList = r.odds || [];
    for (const o of oddsList) {
      const mkt = (o.market || '').toLowerCase();
      const sel = (o.selection || '').toLowerCase();
      if (!hOdds && sel === 'home' && (mkt.includes('h2h') || mkt.includes('moneyline') || mkt.includes('1x2'))) {
        hOdds = o.odds_decimal;
      } else if (!aOdds && sel === 'away' && (mkt.includes('h2h') || mkt.includes('moneyline') || mkt.includes('1x2'))) {
        aOdds = o.odds_decimal;
      } else if (!totLine && (sel === 'over' || sel === 'under') && o.line != null) {
        totLine = o.line;
      }
    }

    if (!hOdds) hOdds = Number(((1.0 / Math.max(probHome || 0.44, 0.05)) * 1.055).toFixed(2));
    if (!aOdds) aOdds = Number(((1.0 / Math.max(probAway || 0.38, 0.05)) * 1.055).toFixed(2));
    if (!totLine) {
      if (metrics.expected_total_goals) {
        totLine = isSoccer ? 2.5 : +(Math.round(metrics.expected_total_goals * 2.0) / 2.0).toFixed(1);
      } else {
        totLine = isSoccer ? 2.5 : null;
      }
    }

    const seenPickKeys = new Set<string>();
    const rawPicks = (r.picks || []).filter((p: any) => {
      if (!p) return false;
      if (p.superseded) {
        if (!Array.isArray(p.superseded) || p.superseded.length > 0) return false;
      }
      const key = `${p.tier || 'oficial'}::${(p.market || '').trim().toLowerCase()}::${(p.selection || '').trim().toLowerCase()}`;
      if (seenPickKeys.has(key)) return false;
      seenPickKeys.add(key);
      return true;
    });

    const picks = rawPicks.map((p: any) => {
      const resObj = p.results;
      let result = null;
      let actualOutcome = null;
      if (Array.isArray(resObj) && resObj.length > 0) {
        result = resObj[0].result;
        actualOutcome = resObj[0].actual_outcome;
      } else if (resObj && typeof resObj === 'object') {
        result = resObj.result;
        actualOutcome = resObj.actual_outcome;
      }
      return {
        ...p,
        result,
        actual_outcome: actualOutcome,
        tier: p.tier || 'oficial',
        support_stat: p.support_stat || null,
        sample_size: p.sample_size || null,
        explanation_short: p.explanation_short || null,
        model_version: p.model_version || 'v2.1'
      };
    });

    const valuePick = picks.find((p: any) => p.tier === 'oficial' && (p.edge || 0) >= 0.02)
      || picks.find((p: any) => p.tier === 'probable')
      || picks[0]
      || null;

    return {
      ...r,
      prob_home_pct: probHomePct,
      prob_away_pct: probAwayPct,
      prob_draw_pct: probDrawPct,
      model_favorite: probHome >= (probAway ?? 0) ? 'home' : 'away',
      model_favorite_prob: Math.max(probHome, probAway ?? 0),
      odds_summary: {
        home: hOdds,
        away: aOdds,
        total_line: totLine
      },
      picks,
      value_pick: valuePick
    };
  }

  private async fetchLeaguesDirectFromSupabase(sport?: string): Promise<League[]> {
    await this.supabase.ensureReady();
    const client = this.supabase.getClient();
    if (!client) return [];

    try {
      let query = client.from('leagues').select('*').eq('active', true);
      if (sport && sport.toLowerCase() !== 'all') {
        query = query.eq('sport_id', sport);
      }
      const { data, error } = await query;
      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  }

  private async fetchPicksDirectFromSupabase(sport?: string, confidence?: string, minEdge?: number): Promise<PickItem[]> {
    await this.supabase.ensureReady();
    const client = this.supabase.getClient();
    if (!client) return [];

    try {
      let query = client
        .from('v_active_picks')
        .select('*, results:pick_results(*), match:matches(*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*))')
        .order('created_at', { ascending: false })
        .limit(100);

      if (sport && sport.toLowerCase() !== 'all') {
        query = query.eq('sport', sport === 'futbol' ? 'soccer' : sport);
      }
      if (confidence) {
        query = query.eq('confidence', confidence);
      }
      if (minEdge !== undefined) {
        query = query.gte('edge', minEdge);
      }

      const { data, error } = await query;
      if (error || !data) return [];

      return data.map((p: any) => {
        const resObj = p.results;
        let result = null;
        let actualOutcome = null;
        if (Array.isArray(resObj) && resObj.length > 0) {
          result = resObj[0].result;
          actualOutcome = resObj[0].actual_outcome;
        } else if (resObj && typeof resObj === 'object') {
          result = resObj.result;
          actualOutcome = resObj.actual_outcome;
        }
        return {
          ...p,
          result,
          actual_outcome: actualOutcome
        };
      });
    } catch {
      return [];
    }
  }

  private computeTeamAveragesFromGames(games: any[], sport: string): any {
    if (!games || games.length === 0) return {};
    const n = games.length;
    let shots = 0, shotsOnTarget = 0, poss = 0, corners = 0, fouls = 0, cards = 0, saves = 0, offsides = 0;
    let points = 0, reb = 0, ast = 0, tov = 0, fg3m = 0, fgPct = 0;
    let yards = 0, passYards = 0, rushYards = 0, firstDowns = 0;

    for (const g of games) {
      const st = g.team_stats || {};
      shots += Number(st.shots || st.totalShots || 0);
      shotsOnTarget += Number(st.shots_on_target || st.shotsOnTarget || 0);
      poss += Number(st.possession_pct || st.possessionPct || 50);
      corners += Number(st.corners || st.wonCorners || 0);
      fouls += Number(st.fouls || st.foulsCommitted || 0);
      cards += Number(st.yellow_cards || st.yellowCards || 0);
      saves += Number(st.saves || 0);
      offsides += Number(st.offsides || 0);

      points += Number(st.points || st.pts || g.team_score || 0);
      reb += Number(st.rebounds || st.reb || 0);
      ast += Number(st.assists || st.ast || 0);
      tov += Number(st.turnovers || st.tov || 0);
      fg3m += Number(st.three_pointers_made || st.fg3m || 0);
      fgPct += Number(st.field_goal_pct || st.fg_pct || 45);

      yards += Number(st.total_yards || 0);
      passYards += Number(st.passing_yards || 0);
      rushYards += Number(st.rushing_yards || 0);
      firstDowns += Number(st.first_downs || 0);
    }

    if (sport === 'nba') {
      return {
        points: Math.round(points / n) || 112,
        field_goal_pct: Math.round(fgPct / n) || 46,
        three_pointers_made: +(fg3m / n).toFixed(1) || 12.5,
        free_throw_pct: 78,
        rebounds: +(reb / n).toFixed(1) || 43.5,
        assists: +(ast / n).toFixed(1) || 26.0,
        turnovers: +(tov / n).toFixed(1) || 13.5
      };
    }

    if (sport === 'nfl') {
      return {
        total_yards: Math.round(yards / n) || 340,
        passing_yards: Math.round(passYards / n) || 225,
        rushing_yards: Math.round(rushYards / n) || 115,
        first_downs: Math.round(firstDowns / n) || 20,
        turnovers: 1
      };
    }

    return {
      shots: +(shots / n).toFixed(1) || 13.5,
      shots_on_target: +(shotsOnTarget / n).toFixed(1) || 4.8,
      possession_pct: +(poss / n).toFixed(1) || 50.0,
      corners: +(corners / n).toFixed(1) || 5.2,
      fouls: +(fouls / n).toFixed(1) || 11.8,
      yellow_cards: +(cards / n).toFixed(1) || 1.9,
      red_cards: 0,
      saves: +(saves / n).toFixed(1) || 3.2,
      offsides: +(offsides / n).toFixed(1) || 1.7
    };
  }

  private computePlayerAverages(hist: any[], sport: string): any {
    if (!hist || hist.length === 0) {
      if (sport === 'nba') {
        return { PTS: 14.5, points: 14.5, pts: 14.5, REB: 4.8, rebounds: 4.8, reb: 4.8, AST: 3.2, assists: 3.2, ast: 3.2, '3PT': 1.8, '3PM': 1.8, MIN: 28, minutes: 28 };
      }
      if (sport === 'nfl') {
        return { passing_passingYards: 180, touchdowns: 1, rushing_rushingYards: 45, receiving_receptions: 4, receiving_receivingYards: 52, minutes: 60 };
      }
      if (sport === 'mlb') {
        return { hits: 1, runs: 1, homeRuns: 0, rbi: 1, atBats: 4 };
      }
      return { totalGoals: 0.8, goals: 0.8, goalAssists: 0.4, ast: 0.4, totalShots: 2.2, shots: 2.2, shotsOnTarget: 1.1, sot: 1.1, yellowCards: 0.2, minutes: 90 };
    }

    const n = hist.length;
    let pts = 0, reb = 0, ast = 0, min = 0, tpm = 0, stl = 0, blk = 0;
    let goals = 0, goalAst = 0, shots = 0, sot = 0, cards = 0, fls = 0;
    let passYds = 0, tds = 0, rushYds = 0, rec = 0, recYds = 0;
    let hits = 0, runs = 0, hr = 0, rbi = 0, ab = 0;

    for (const h of hist) {
      let st = h.stats || {};
      if (typeof st === 'string') {
        try { st = JSON.parse(st); } catch { st = {}; }
      }
      st = st || {};
      min += Number(h.minutes || st.MIN || st.min || 0);

      pts += Number(st.PTS || st.points || st.pts || 0);
      reb += Number(st.REB || st.rebounds || st.reb || (st.DREB != null && st.OREB != null ? Number(st.DREB) + Number(st.OREB) : 0));
      ast += Number(st.AST || st.assists || st.ast || 0);
      const raw3 = String(st['3PT'] || st['3PM'] || st.threePointersMade || 0);
      tpm += Number(raw3.includes('-') ? raw3.split('-')[0] : raw3) || 0;
      stl += Number(st.STL || st.stl || st.steals || 0);
      blk += Number(st.BLK || st.blk || st.blocks || 0);

      goals += Number(st.totalGoals || st.goals || 0);
      goalAst += Number(st.goalAssists || st.ast || 0);
      shots += Number(st.totalShots || st.shots || 0);
      sot += Number(st.shotsOnTarget || st.sot || 0);
      cards += Number(st.yellowCards || 0);
      fls += Number(st.foulsCommitted || st.fls || 0);

      passYds += Number(st.passing_passingYards || st.passingYards || 0);
      tds += Number(st.touchdowns || st.passing_passingTouchdowns || st.rushing_rushingTouchdowns || 0);
      rushYds += Number(st.rushing_rushingYards || st.rushingYards || 0);
      rec += Number(st.receiving_receptions || st.receptions || 0);
      recYds += Number(st.receiving_receivingYards || st.receivingYards || 0);

      const b = st.batting || {};
      hits += Number(b.hits || st.hits || 0);
      runs += Number(b.runs || st.runs || 0);
      hr += Number(b.homeRuns || st.homeRuns || st.hr || 0);
      rbi += Number(b.rbi || st.rbi || 0);
      ab += Number(b.atBats || st.atBats || 4);
    }

    if (sport === 'nba') {
      const avgPts = +(pts / n).toFixed(1);
      const avgReb = +(reb / n).toFixed(1);
      const avgAst = +(ast / n).toFixed(1);
      const avg3pm = +(tpm / n).toFixed(1);
      const avgStl = +(stl / n).toFixed(1);
      const avgBlk = +(blk / n).toFixed(1);
      const avgPra = +(avgPts + avgReb + avgAst).toFixed(1);
      const avgMin = Math.round(min / n) || 28;
      return {
        PTS: avgPts, points: avgPts, pts: avgPts,
        REB: avgReb, rebounds: avgReb, reb: avgReb,
        AST: avgAst, assists: avgAst, ast: avgAst,
        '3PT': avg3pm, '3PM': avg3pm, '3pm': avg3pm,
        PRA: avgPra, pra: avgPra,
        STL: avgStl, stl: avgStl,
        BLK: avgBlk, blk: avgBlk,
        MIN: avgMin, minutes: avgMin
      };
    }

    if (sport === 'nfl') {
      const pYds = Math.round(passYds / n);
      const pTds = +(tds / n).toFixed(1);
      const rYds = Math.round(rushYds / n);
      const rRec = +(rec / n).toFixed(1);
      const rcYds = Math.round(recYds / n);
      return {
        passing_passingYards: pYds, pass_yds: pYds, 'PASS YDS': pYds,
        touchdowns: pTds, pass_td: pTds, 'PASS TD': pTds,
        rushing_rushingYards: rYds, rush_yds: rYds, 'RUSH YDS': rYds,
        receiving_receptions: rRec, rec: rRec, 'REC': rRec,
        receiving_receivingYards: rcYds, rec_yds: rcYds, 'REC YDS': rcYds,
        minutes: 60
      };
    }

    if (sport === 'mlb') {
      return {
        hits: +(hits / n).toFixed(1), H: +(hits / n).toFixed(1),
        runs: +(runs / n).toFixed(1), R: +(runs / n).toFixed(1),
        homeRuns: +(hr / n).toFixed(1), HR: +(hr / n).toFixed(1),
        rbi: +(rbi / n).toFixed(1), RBI: +(rbi / n).toFixed(1),
        so: 1, SO: 1,
        atBats: Math.round(ab / n) || 4
      };
    }

    const avgG = +(goals / n).toFixed(1);
    const avgA = +(goalAst / n).toFixed(1);
    const avgSot = +(sot / n).toFixed(1);
    const avgFls = +(fls / n).toFixed(1);
    return {
      totalGoals: avgG, goals: avgG, GOL: avgG,
      goalAssists: avgA, ast: avgA, AST: avgA,
      totalShots: +(shots / n).toFixed(1), shots: +(shots / n).toFixed(1),
      shotsOnTarget: avgSot, sot: avgSot, SOT: avgSot,
      foulsCommitted: avgFls, fls: avgFls, FLS: avgFls,
      ga: +(avgG + avgA).toFixed(1), 'G+A': +(avgG + avgA).toFixed(1),
      pas: 1.5, PAS: 1.5,
      yellowCards: +(cards / n).toFixed(1),
      minutes: Math.round(min / n) || 90
    };
  }

    private async fetchDeepRecentFormAndH2H(
    client: any,
    homeTeamId: string,
    awayTeamId: string,
    homeTeamName?: string,
    awayTeamName?: string
  ): Promise<{ recent_form: TeamRecentForm[]; h2h: any }> {
    try {
      const [hRes, aRes, h2hRes] = await Promise.all([
        client.from('matches')
          .select('id, kickoff_utc, league_id, home_team_id, away_team_id, home_score, away_score, home_team:teams!home_team_id(id, name, logo_url), away_team:teams!away_team_id(id, name, logo_url)')
          .or(`home_team_id.eq.${homeTeamId},away_team_id.eq.${homeTeamId}`)
          .eq('status', 'finished')
          .not('home_score', 'is', null)
          .order('kickoff_utc', { ascending: false })
          .limit(50),
        client.from('matches')
          .select('id, kickoff_utc, league_id, home_team_id, away_team_id, home_score, away_score, home_team:teams!home_team_id(id, name, logo_url), away_team:teams!away_team_id(id, name, logo_url)')
          .or(`home_team_id.eq.${awayTeamId},away_team_id.eq.${awayTeamId}`)
          .eq('status', 'finished')
          .not('home_score', 'is', null)
          .order('kickoff_utc', { ascending: false })
          .limit(50),
        client.from('matches')
          .select('id, kickoff_utc, league_id, home_team_id, away_team_id, home_score, away_score, home_team:teams!home_team_id(id, name, logo_url), away_team:teams!away_team_id(id, name, logo_url)')
          .or(`and(home_team_id.eq.${homeTeamId},away_team_id.eq.${awayTeamId}),and(home_team_id.eq.${awayTeamId},away_team_id.eq.${homeTeamId})`)
          .eq('status', 'finished')
          .not('home_score', 'is', null)
          .order('kickoff_utc', { ascending: false })
          .limit(50)
      ]);

      const mapGames = (records: any[], targetTeamId: string): RecentFormGame[] => {
        return (records || []).map((r: any) => {
          const isHome = r.home_team_id === targetTeamId;
          const opp = isHome ? r.away_team : r.home_team;
          const oppId = isHome ? r.away_team_id : r.home_team_id;
          const tScore = isHome ? Number(r.home_score) : Number(r.away_score);
          const oppScore = isHome ? Number(r.away_score) : Number(r.home_score);
          let result = 'D';
          if (tScore > oppScore) result = 'W';
          else if (tScore < oppScore) result = 'L';

          return {
            id: String(r.id),
            date: (r.kickoff_utc || '').split('T')[0],
            score: `${r.home_score}-${r.away_score}`,
            score_display: `${r.home_score} - ${r.away_score}`,
            result,
            opponent_name: opp?.name || 'Rival',
            opponent_id: oppId,
            opponent_logo: opp?.logo_url,
            is_home: isHome,
            league_id: r.league_id,
            competition: r.league_id
          };
        });
      };

      const hGames = mapGames(hRes.data || [], homeTeamId);
      const aGames = mapGames(aRes.data || [], awayTeamId);

      let hWins = 0, aWins = 0, draws = 0;
      const h2hMatches: H2HMatch[] = (h2hRes.data || []).map((r: any) => {
        const hs = Number(r.home_score);
        const as_ = Number(r.away_score);
        if (hs > as_) {
          if (r.home_team_id === homeTeamId) hWins++;
          else aWins++;
        } else if (as_ > hs) {
          if (r.away_team_id === awayTeamId) aWins++;
          else hWins++;
        } else {
          draws++;
        }
        return {
          id: String(r.id),
          date: (r.kickoff_utc || '').split('T')[0],
          home_team_name: r.home_team?.name || 'Local',
          away_team_name: r.away_team?.name || 'Visitante',
          home_team_id: r.home_team_id,
          away_team_id: r.away_team_id,
          home_team_logo: r.home_team?.logo_url,
          away_team_logo: r.away_team?.logo_url,
          home_score: hs,
          away_score: as_,
          competition: r.league_id,
          league_name: r.league_id,
          league_id: r.league_id
        };
      });

      return {
        recent_form: [
          { team_id: homeTeamId, team_name: homeTeamName || 'Local', games: hGames },
          { team_id: awayTeamId, team_name: awayTeamName || 'Visitante', games: aGames }
        ],
        h2h: {
          home_wins: hWins,
          away_wins: aWins,
          draws: draws,
          matches: h2hMatches,
          summary_text: `Historial de ${h2hMatches.length} partidos entre ambos equipos`
        }
      };
    } catch (e) {
      console.warn('fetchDeepRecentFormAndH2H error:', e);
      return {
        recent_form: [],
        h2h: { home_wins: 0, away_wins: 0, draws: 0, matches: [] }
      };
    }
  }

  private async fetchMatchDetailDirectFromSupabase(matchId: string, sport?: string, league?: string): Promise<MatchDetailResponse> {
    await this.supabase.ensureReady();
    const client = this.supabase.getClient();
    if (!client) throw new Error('Supabase client not ready');

    try {
      const { data, error } = await client.rpc('get_complete_match_detail', { p_match_id: matchId, p_recent_limit: 10 });
      if (!error && data && data.match) {
        const formattedMatch = this.formatMatchRecord({
          ...data.match,
          odds: data.odds,
          picks: data.picks
        });

        let teamStats: (TeamMatchStatsItem | null)[] = data.team_stats || [];
        if (teamStats.length >= 2) {
          const homeItem = (teamStats.find((s: any) => s && (s.is_home === true || s.team_id === formattedMatch.home_team_id)) || teamStats[0]) as any || {};
          const awayItem = (teamStats.find((s: any) => s && (s.is_home === false || s.team_id === formattedMatch.away_team_id)) || teamStats[1]) as any || {};
          teamStats = [
            { ...homeItem, is_home: true, soccer: homeItem.soccer || homeItem.stats || homeItem.raw_stats || {}, stats: homeItem.stats || homeItem.soccer || homeItem.raw_stats || {} },
            { ...awayItem, is_home: false, soccer: awayItem.soccer || awayItem.stats || awayItem.raw_stats || {}, stats: awayItem.stats || awayItem.soccer || awayItem.raw_stats || {} }
          ];
        } else if (data.recent_form && data.recent_form.length >= 2) {
          const sId = formattedMatch.sport_id || sport || 'futbol';
          const homeRf = data.recent_form.find((rf: any) => rf.team_id === formattedMatch.home_team_id) || data.recent_form[0];
          const awayRf = data.recent_form.find((rf: any) => rf.team_id === formattedMatch.away_team_id) || data.recent_form[1];
          const homeAvg = this.computeTeamAveragesFromGames(homeRf?.games || [], sId);
          const awayAvg = this.computeTeamAveragesFromGames(awayRf?.games || [], sId);
          teamStats = [
            { team_id: formattedMatch.home_team_id, is_home: true, soccer: homeAvg, stats: homeAvg, raw_stats: homeAvg },
            { team_id: formattedMatch.away_team_id, is_home: false, soccer: awayAvg, stats: awayAvg, raw_stats: awayAvg }
          ];
        }

        let playerStats: PlayerMatchStatsItem[] = data.player_stats || [];
        const sId = formattedMatch.sport_id || sport || 'futbol';

        if (playerStats.length === 0 && formattedMatch.home_team_id && formattedMatch.away_team_id) {
          try {
            // First check if there are direct player_match_stats for this match in Supabase
            const { data: directStats } = await client
              .from('player_match_stats')
              .select('*, player:players(*)')
              .eq('match_id', matchId)
              .limit(60);

            if (directStats && directStats.length > 0) {
              playerStats = directStats.map((ds: any) => ({
                player_id: ds.player_id,
                team_id: ds.team_id,
                starter: ds.starter ?? true,
                minutes: ds.minutes || (ds.stats?.MIN || 0),
                stats: ds.stats || {},
                has_match_stats: true,
                player_name: ds.player?.name || 'Jugador',
                jersey: ds.jersey || ds.player?.jersey || '-',
                position: ds.position || ds.player?.position || 'Jugador',
                photo_url: ds.photo_url || ds.player?.photo_url,
                player: ds.player || {}
              }));
            } else {
              // Upcoming match: rosters loaded with empty stats so card displays '-' until match finishes
              const { data: roster } = await client
                .from('players')
                .select('id, name, jersey, position, photo_url, team_id')
                .in('team_id', [formattedMatch.home_team_id, formattedMatch.away_team_id])
                .limit(60);

              if (roster && roster.length > 0) {
                playerStats = roster.map((rp: any) => ({
                  player_id: rp.id,
                  team_id: rp.team_id,
                  starter: true,
                  minutes: '-',
                  stats: {},
                  has_match_stats: false,
                  player_name: rp.name,
                  jersey: rp.jersey || '-',
                  position: rp.position || 'Jugador',
                  photo_url: rp.photo_url,
                  player: {
                    id: rp.id,
                    name: rp.name,
                    jersey: rp.jersey,
                    position: rp.position || 'Jugador',
                    photo_url: rp.photo_url
                  }
                }));
              }
            }
          } catch (rosterErr) {
            console.warn('Roster fetch error:', rosterErr);
          }
        }

        const deepData = await this.fetchDeepRecentFormAndH2H(
          client,
          formattedMatch.home_team_id || '',
          formattedMatch.away_team_id || '',
          formattedMatch.home_team?.name,
          formattedMatch.away_team?.name
        );

        return {
          match: formattedMatch,
          team_stats: teamStats,
          player_stats: playerStats,
          odds: data.odds || [],
          recent_form: (deepData.recent_form && deepData.recent_form[0]?.games?.length > 0) ? deepData.recent_form : (data.recent_form || []),
          h2h: (deepData.h2h && deepData.h2h.matches?.length > 0) ? deepData.h2h : (data.h2h || { home_wins: 0, away_wins: 0, draws: 0, matches: [] }),
          picks: formattedMatch.picks || [],
          simulations: data.simulations || [],
          is_partial: false,
          partial: false
        };
      }
    } catch (e) {
      console.warn('RPC get_complete_match_detail failed, fallback to tables:', e);
    }

    const [matchRes, statsRes, oddsRes, picksRes] = await Promise.all([
      client.from('matches').select('*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*), simulations:simulation_runs(*)').eq('id', matchId).single(),
      client.from('team_match_stats').select('*').eq('match_id', matchId),
      client.from('odds_snapshots').select('*').eq('match_id', matchId),
      client.from('v_active_picks').select('*, results:pick_results(*)').eq('match_id', matchId)
    ]);

    const m = matchRes.data ? this.formatMatchRecord({ ...matchRes.data, odds: oddsRes.data, picks: picksRes.data }) : ({} as any);

    let fallbackTeamStats = (statsRes.data || []).map((s: any) => ({
      team_id: s.team_id,
      is_home: s.is_home,
      soccer: s.raw_stats || s.stats || {},
      stats: s.raw_stats || s.stats || {},
      raw_stats: s.raw_stats || s.stats || {}
    }));

    let fallbackPlayers: PlayerMatchStatsItem[] = [];
    const sportClean = m.sport_id || sport || 'futbol';
    if (m.home_team_id && m.away_team_id) {
      try {
        const { data: directStats } = await client
          .from('player_match_stats')
          .select('*, player:players(*)')
          .eq('match_id', matchId)
          .limit(60);

        if (directStats && directStats.length > 0) {
          fallbackPlayers = directStats.map((ds: any) => ({
            player_id: ds.player_id,
            team_id: ds.team_id,
            starter: ds.starter ?? true,
            minutes: ds.minutes || 0,
            stats: ds.stats || {},
            has_match_stats: true,
            player_name: ds.player?.name || 'Jugador',
            jersey: ds.jersey || ds.player?.jersey || '-',
            position: ds.position || ds.player?.position || 'Jugador',
            photo_url: ds.photo_url || ds.player?.photo_url,
            player: ds.player || {}
          }));
        } else {
          // Upcoming match: rosters loaded with empty stats so cards display '-' until match finishes
          const { data: roster } = await client
            .from('players')
            .select('id, name, jersey, position, photo_url, team_id')
            .in('team_id', [m.home_team_id, m.away_team_id])
            .limit(60);
          if (roster) {
            fallbackPlayers = roster.map((rp: any) => ({
              player_id: rp.id,
              team_id: rp.team_id,
              starter: true,
              minutes: '-',
              stats: {},
              has_match_stats: false,
              player_name: rp.name,
              jersey: rp.jersey || '-',
              position: rp.position || 'Jugador',
              photo_url: rp.photo_url,
              player: {
                id: rp.id,
                name: rp.name,
                jersey: rp.jersey,
                position: rp.position || 'Jugador',
                photo_url: rp.photo_url
              }
            }));
          }
        }
      } catch {}
    }

    return {
      match: m,
      team_stats: fallbackTeamStats,
      player_stats: fallbackPlayers,
      odds: (oddsRes.data || []).map((o: any) => ({
        bookmaker: o.bookmaker,
        market: o.market,
        selection: o.selection,
        line: o.line,
        odds_decimal: o.odds_decimal
      })),
      recent_form: (await this.fetchDeepRecentFormAndH2H(client, m.home_team_id || '', m.away_team_id || '', m.home_team?.name, m.away_team?.name)).recent_form,
      h2h: (await this.fetchDeepRecentFormAndH2H(client, m.home_team_id || '', m.away_team_id || '', m.home_team?.name, m.away_team?.name)).h2h,
      picks: m.picks || [],
      simulations: matchRes.data?.simulations || [],
      is_partial: false,
      partial: false
    };
  }

  private async fetchParlaysDirectFromSupabase(sport?: string, dateStr?: string): Promise<ParlaysResponse> {
    await this.supabase.ensureReady();
    const client = this.supabase.getClient();
    const emptyRes: ParlaysResponse = {
      safe_parlay: null,
      dream_parlay: null,
      value_parlay: null,
      official_picks: []
    };
    if (!client) return emptyRes;

    try {
      let query = client
        .from('v_active_picks')
        .select('*, match:matches(*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)), result:pick_results(*)')
        .order('created_at', { ascending: false })
        .limit(200);

      const { data, error } = await query;
      if (error || !data) return emptyRes;

      let records = data;
      if (sport && sport.toLowerCase() !== 'all') {
        const sTarget = sport === 'futbol' ? 'soccer' : sport;
        records = records.filter((r: any) => (r.match?.sport_id === sport || r.sport === sTarget || r.sport === sport));
      }

      if (dateStr) {
        records = records.filter((r: any) => {
          const ko = (r.match?.kickoff_utc || '').split('T')[0];
          return ko === dateStr;
        });
      }

      const seenMatches = new Set<string>();
      const validPicks: ParlayLeg[] = [];

      for (const r of records) {
        const m = r.match || {};
        const mId = m.id || r.match_id;
        if (!mId || String(mId).startsWith('test-') || seenMatches.has(mId)) continue;
        const odds = Number(r.odds_used || 1.0);
        const prob = Number(r.prob_model || 0.5);
        if (odds < 1.05) continue;

        seenMatches.add(mId);
        validPicks.push({
          id: r.id,
          match_id: mId,
          sport: m.sport_id || r.sport || 'futbol',
          home_team: m.home_team?.name || 'Local',
          away_team: m.away_team?.name || 'Visitante',
          home_logo: m.home_team?.logo_url,
          away_logo: m.away_team?.logo_url,
          kickoff_utc: m.kickoff_utc,
          market: r.market,
          selection: r.selection,
          line: r.line,
          odds,
          prob_model: prob,
          edge: Number(r.edge || 0.0),
          confidence: r.confidence || 'medium',
          content_hash: r.content_hash,
          created_at: r.created_at
        });
      }

      const buildParlayItem = (subset: ParlayLeg[], title: string, badge: string, risk: string, desc: string): ParlayItem | null => {
        if (!subset || subset.length === 0) return null;
        let cOdds = 1.0;
        let cProb = 1.0;
        for (const p of subset) {
          cOdds *= p.odds;
          cProb *= p.prob_model;
        }
        cOdds = Number(cOdds.toFixed(2));
        const cProbPct = Number((cProb * 100).toFixed(1));
        const ev = Number(((cProb * cOdds - 1.0) * 100).toFixed(1));

        return {
          title,
          badge,
          risk_level: risk,
          description: desc,
          legs_count: subset.length,
          combined_odds: cOdds,
          combined_prob_pct: cProbPct,
          expected_value_pct: ev,
          payout_100_units: Number((cOdds * 100).toFixed(2)),
          payout_10_units: Number((cOdds * 10).toFixed(2)),
          legs: subset
        };
      };

      const safeCandidates = [...validPicks].filter(p => p.odds <= 2.20 && p.prob_model >= 0.45);
      const safeLegs = (safeCandidates.length >= 2 ? safeCandidates : validPicks)
        .sort((a, b) => b.prob_model - a.prob_model)
        .slice(0, 2);

      const valueLegs = [...validPicks]
        .sort((a, b) => b.edge - a.edge)
        .slice(0, 3);

      const dreamLegs = [...validPicks]
        .sort((a, b) => (b.odds * b.prob_model) - (a.odds * a.prob_model))
        .slice(0, 4);

      return {
        safe_parlay: buildParlayItem(safeLegs, 'Parlay Alta Probabilidad', '🛡️ ALTA PROBABILIDAD', 'Bajo / Conservador', 'Selecciones cuantitativas con el porcentaje de victoria más elevado.'),
        value_parlay: buildParlayItem(valueLegs, 'Parlay Máximo Valor (+EV)', '💎 MÁXIMO VALOR', 'Moderado / Balanceado', 'Las mejores ventajas matemáticas (Edge) frente a las casas de apuestas.'),
        dream_parlay: buildParlayItem(dreamLegs, 'Parlay Soñador (Bombazo IA)', '🚀 SOÑADOR / BOMBAZO', 'Alto / Alta Rentabilidad', 'Combinada multiplicativa basada en el modelado estadístico profundo.'),
        official_picks: validPicks
      };
    } catch (e) {
      console.error('fetchParlaysDirectFromSupabase error:', e);
      return emptyRes;
    }
  }

  private async fetchAuditSummaryDirectFromSupabase(
    sport?: string,
    league?: string,
    market?: string,
    minEdge?: number,
    dateStr?: string,
    monthStr?: string,
    selectedTier: string = 'oficial'
  ): Promise<AuditSummary> {
    await this.supabase.ensureReady();
    const client = this.supabase.getClient();
    const emptySummary: AuditSummary = {
      total_evaluated: 0,
      won: 0,
      lost: 0,
      push: 0,
      void: 0,
      win_rate: 0.0,
      roi: 0.0,
      total_profit_units: 0.0,
      brier_score: 0.0,
      log_loss: 0.0,
      clv_avg: 0.0,
      calibration_curve: [],
      breakdown_by_market: [],
      breakdown_by_edge: [],
      breakdown_by_league: [],
      breakdown_by_sport: [],
      recent_picks: [],
      selected_tier: selectedTier
    };
    if (!client) return emptySummary;

    try {
      const { data, error } = await client
        .from('pick_results')
        .select('*, pick:picks(*, superseded:pick_supersessions!old_pick_id(id), match:matches(*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*)))')
        .order('evaluated_at', { ascending: false })
        .limit(1000);

      if (error || !data) return emptySummary;

      let filtered = data.filter((r: any) => {
        const p = r.pick || {};
        const m = p.match || {};
        if (p.superseded && (!Array.isArray(p.superseded) || p.superseded.length > 0)) return false;
        if (String(p.match_id || '').startsWith('test-') || String(m.id || '').startsWith('test-')) return false;
        if (sport && sport.toLowerCase() !== 'all' && m.sport_id !== sport && p.sport !== sport) return false;
        if (league && m.league_id !== league) return false;
        if (market && p.market !== market) return false;
        if (minEdge !== undefined && Number(p.edge || 0) < minEdge) return false;

        const matchDate = (m.kickoff_utc || r.evaluated_at || '').slice(0, 10);
        const evalDate = (r.evaluated_at || '').slice(0, 10);
        if (dateStr && dateStr !== matchDate && dateStr !== evalDate) return false;
        if (monthStr && !matchDate.startsWith(monthStr) && !evalDate.startsWith(monthStr)) return false;

        return true;
      });

      // Categorize into the 3 discrete tiers per user architecture:
      // 1. oficial: Verified +EV mathematical picks (edge <= 10%, not marked suspicious)
      // 2. probable: Empirically backed stats trends without high-margin EV
      // 3. sospechoso: High divergence / suspicious picks (edge > 10% or is_suspicious flag)
      const getPickCategory = (r: any): 'oficial' | 'probable' | 'sospechoso' => {
        const p = r.pick || {};
        const edge = Number(p.edge || 0.0);
        const sp = p.simulation_params || {};
        const isSuspicious = Boolean(sp.is_suspicious) || (p.confidence === 'low' && edge > 0.08) || p.tier === 'sospechoso';
        if (edge > 0.10 || isSuspicious) {
          return 'sospechoso';
        }
        if (p.tier === 'probable') {
          return 'probable';
        }
        return 'oficial';
      };

      const oficialSubset = filtered.filter(r => getPickCategory(r) === 'oficial');
      const probableSubset = filtered.filter(r => getPickCategory(r) === 'probable');
      const sospechosoSubset = filtered.filter(r => getPickCategory(r) === 'sospechoso');

      const calcPerformance = (subset: any[], tierId: 'oficial' | 'probable' | 'sospechoso', label: string): TierPerformance => {
        const won = subset.filter((r: any) => r.result === 'won').length;
        const lost = subset.filter((r: any) => r.result === 'lost').length;
        const push = subset.filter((r: any) => r.result === 'push').length;
        const dec = won + lost;
        const wr = dec > 0 ? Number(((won / dec) * 100).toFixed(1)) : 0.0;
        let profit = 0.0;
        for (const r of subset) {
          const odds = Number(r.pick?.odds_used || 1.0);
          if (r.result === 'won') profit += (odds - 1.0);
          else if (r.result === 'lost') profit -= 1.0;
        }
        const roi = dec > 0 ? Number(((profit / dec) * 100).toFixed(1)) : 0.0;
        return {
          tier_id: tierId,
          label,
          total_evaluated: subset.length,
          won,
          lost,
          push,
          win_rate: wr,
          roi,
          total_profit_units: Number(profit.toFixed(2))
        };
      };

      const tierSummaries = {
        oficial: calcPerformance(oficialSubset, 'oficial', 'Picks Oficiales (+EV)'),
        probable: calcPerformance(probableSubset, 'probable', 'Probables por Stats'),
        sospechoso: calcPerformance(sospechosoSubset, 'sospechoso', 'Sospechosas / Divergentes')
      };

      // Active target dataset based on selectedTier tab
      let targetSubset = oficialSubset;
      if (selectedTier === 'probable') targetSubset = probableSubset;
      else if (selectedTier === 'sospechoso') targetSubset = sospechosoSubset;
      else if (selectedTier === 'all') targetSubset = filtered;

      const total = targetSubset.length;
      const won = targetSubset.filter((r: any) => r.result === 'won').length;
      const lost = targetSubset.filter((r: any) => r.result === 'lost').length;
      const push = targetSubset.filter((r: any) => r.result === 'push').length;
      const voidCount = targetSubset.filter((r: any) => r.result === 'void').length;
      const decided = won + lost;
      const winRate = decided > 0 ? Number(((won / decided) * 100).toFixed(1)) : 0.0;

      let totalProfit = 0.0;
      let brierSum = 0.0;
      let clvSum = 0.0;

      for (const r of targetSubset) {
        const p = r.pick || {};
        const odds = Number(p.odds_used || 1.0);
        const prob = Math.max(0.01, Math.min(0.99, Number(p.prob_model || 0.5)));
        clvSum += Number(p.edge || 0.0);

        if (r.result === 'won') {
          totalProfit += (odds - 1.0);
          brierSum += Math.pow(prob - 1.0, 2);
        } else if (r.result === 'lost') {
          totalProfit -= 1.0;
          brierSum += Math.pow(prob - 0.0, 2);
        }
      }

      const roi = decided > 0 ? Number(((totalProfit / decided) * 100).toFixed(1)) : 0.0;
      const brierScore = decided > 0 ? Number((brierSum / decided).toFixed(4)) : 0.0;
      const clvAvg = total > 0 ? Number(((clvSum / total) * 100).toFixed(2)) : 0.0;

      // Calibration Curve on target subset
      const bins = [
        { label: '50-60%', min: 0.50, max: 0.60, count: 0, won: 0, predSum: 0 },
        { label: '60-70%', min: 0.60, max: 0.70, count: 0, won: 0, predSum: 0 },
        { label: '70-80%', min: 0.70, max: 0.80, count: 0, won: 0, predSum: 0 },
        { label: '80%+', min: 0.80, max: 1.01, count: 0, won: 0, predSum: 0 }
      ];

      for (const r of targetSubset) {
        const prob = Number(r.pick?.prob_model || 0.5);
        for (const b of bins) {
          if (prob >= b.min && prob < b.max) {
            b.count++;
            b.predSum += prob;
            if (r.result === 'won') b.won++;
            break;
          }
        }
      }

      const calibrationCurve: CalibrationBin[] = bins.map(b => ({
        bin_label: b.label,
        predicted_avg: b.count > 0 ? Number(((b.predSum / b.count) * 100).toFixed(1)) : (b.min * 100),
        actual_win_rate: b.count > 0 ? Number(((b.won / b.count) * 100).toFixed(1)) : 0,
        sample_size: b.count
      }));

      // Breakdown by Market on target subset
      const marketMap = new Map<string, { won: number; lost: number; profit: number }>();
      for (const r of targetSubset) {
        const mkt = r.pick?.market || 'Otro';
        if (!marketMap.has(mkt)) marketMap.set(mkt, { won: 0, lost: 0, profit: 0 });
        const entry = marketMap.get(mkt)!;
        const odds = Number(r.pick?.odds_used || 1.0);
        if (r.result === 'won') {
          entry.won++;
          entry.profit += (odds - 1.0);
        } else if (r.result === 'lost') {
          entry.lost++;
          entry.profit -= 1.0;
        }
      }

      const breakdownByMarket: MarketBreakdown[] = Array.from(marketMap.entries()).map(([marketName, v]) => {
        const dec = v.won + v.lost;
        return {
          market: marketName,
          sample_size: dec,
          won: v.won,
          lost: v.lost,
          win_rate: dec > 0 ? Number(((v.won / dec) * 100).toFixed(1)) : 0,
          roi: dec > 0 ? Number(((v.profit / dec) * 100).toFixed(1)) : 0,
          profit_units: Number(v.profit.toFixed(2))
        };
      });

      const recentPicks: AuditedPickItem[] = targetSubset.slice(0, 50).map((r: any) => ({
        id: r.id,
        pick_id: r.pick_id,
        result: r.result,
        market: r.pick?.market || '',
        selection: r.pick?.selection || '',
        line: r.pick?.line,
        odds_used: Number(r.pick?.odds_used || 1.0),
        prob_model: Number(r.pick?.prob_model || 0.5),
        edge: Number(r.pick?.edge || 0.0),
        confidence: r.pick?.confidence || 'medium',
        content_hash: r.pick?.content_hash || '',
        evaluated_at: r.evaluated_at,
        home_team_name: r.pick?.match?.home_team?.name || 'Local',
        away_team_name: r.pick?.match?.away_team?.name || 'Visitante',
        home_team_logo: r.pick?.match?.home_team?.logo_url,
        away_team_logo: r.pick?.match?.away_team?.logo_url,
        home_score: r.pick?.match?.home_score,
        away_score: r.pick?.match?.away_score,
        actual_outcome: r.actual_outcome,
        tier: getPickCategory(r),
        is_suspicious: getPickCategory(r) === 'sospechoso'
      }));

      return {
        total_evaluated: total,
        won,
        lost,
        push,
        void: voidCount,
        win_rate: winRate,
        roi,
        total_profit_units: Number(totalProfit.toFixed(2)),
        brier_score: brierScore,
        log_loss: 0.0,
        clv_avg: clvAvg,
        calibration_curve: calibrationCurve,
        breakdown_by_market: breakdownByMarket,
        breakdown_by_edge: [],
        breakdown_by_league: [],
        breakdown_by_sport: [],
        recent_picks: recentPicks,
        selected_tier: selectedTier,
        tier_summaries: tierSummaries,
        probable_summary: {
          total_evaluated: tierSummaries.probable.total_evaluated,
          won: tierSummaries.probable.won,
          lost: tierSummaries.probable.lost,
          push: tierSummaries.probable.push,
          win_rate: tierSummaries.probable.win_rate
        }
      };
    } catch (e) {
      console.error('fetchAuditSummaryDirectFromSupabase error:', e);
      return emptySummary;
    }
  }

  private async fetchPlayerGamelogDirectFromSupabase(playerId: string, matchId?: string): Promise<PlayerGamelogResponse> {
    await this.supabase.ensureReady();
    const client = this.supabase.getClient();
    if (!client) {
      throw new Error('Supabase client not ready');
    }

    const cleanId = String(playerId).replace(/^(nba_|futbol_|nfl_|mlb_)/, '');
    const idVariants = [String(playerId), cleanId, `nba_${cleanId}`, `futbol_${cleanId}`, `nfl_${cleanId}`];

    // 1. Fetch player bio
    let playerBio: any = null;
    try {
      const { data: pData } = await client
        .from('players')
        .select('*, team:teams!team_id(*)')
        .in('id', idVariants)
        .limit(1);

      if (pData && pData.length > 0) {
        playerBio = pData[0];
      }
    } catch {}

    if (!playerBio) {
      playerBio = {
        id: playerId,
        name: 'Jugador',
        jersey: '-',
        position: 'Jugador',
        sport_id: 'futbol'
      };
    }

    const sport = playerBio.sport_id || 'futbol';

    // 2. Query player_match_stats
    let statsRows: any[] = [];
    try {
      const { data } = await client
        .from('player_match_stats')
        .select('*, match:matches(id,kickoff_utc,home_score,away_score,home_team:teams!home_team_id(id,name,short_name,logo_url),away_team:teams!away_team_id(id,name,short_name,logo_url))')
        .in('player_id', idVariants)
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) statsRows = data;
    } catch (e) {
      console.warn('Gamelog query warning:', e);
    }

    const gamelog: PlayerGamelogRow[] = statsRows.map((r: any) => {
      const m = r.match || {};
      const isHome = r.team_id === m.home_team?.id;
      const opp = isHome ? m.away_team : m.home_team;
      const myScore = isHome ? m.home_score : m.away_score;
      const oppScore = isHome ? m.away_score : m.home_score;
      let res: 'G' | 'P' | 'E' = 'E';
      if (myScore !== null && oppScore !== null) {
        if (myScore > oppScore) res = 'G';
        else if (myScore < oppScore) res = 'P';
      }

      let rawSt = r.stats || {};
      if (typeof rawSt === 'string') {
        try { rawSt = JSON.parse(rawSt); } catch { rawSt = {}; }
      }
      rawSt = rawSt || {};
      const pts = Number(rawSt.PTS ?? rawSt.points ?? rawSt.pts ?? 0);
      const reb = Number(rawSt.REB ?? rawSt.rebounds ?? rawSt.reb ?? (rawSt.DREB != null && rawSt.OREB != null ? Number(rawSt.DREB) + Number(rawSt.OREB) : 0));
      const ast = Number(rawSt.AST ?? rawSt.assists ?? rawSt.ast ?? 0);
      const raw3 = String(rawSt['3PT'] ?? rawSt['3PM'] ?? rawSt.threePointersMade ?? 0);
      const tpm = Number(raw3.includes('-') ? raw3.split('-')[0] : raw3) || 0;
      const stl = Number(rawSt.STL ?? rawSt.steals ?? rawSt.stl ?? 0);
      const blk = Number(rawSt.BLK ?? rawSt.blocks ?? rawSt.blk ?? 0);
      const pra = pts + reb + ast;

      const normStats: Record<string, any> = {
        ...rawSt,
        // NBA normalized
        pts, PTS: pts,
        reb, REB: reb,
        ast, AST: ast,
        '3pm': tpm, '3PM': tpm,
        '3pt': tpm, '3PT': raw3,
        pra, PRA: pra,
        stl, STL: stl,
        blk, BLK: blk,
        // NFL normalized
        pass_yds: Number(rawSt.passing_passingYards ?? rawSt.passingYards ?? rawSt.pass_yds ?? 0),
        'PASS YDS': Number(rawSt.passing_passingYards ?? rawSt.passingYards ?? rawSt.pass_yds ?? 0),
        pass_td: Number(rawSt.passing_passingTouchdowns ?? rawSt.passingTouchdowns ?? rawSt.pass_td ?? 0),
        'PASS TD': Number(rawSt.passing_passingTouchdowns ?? rawSt.passingTouchdowns ?? rawSt.pass_td ?? 0),
        rush_yds: Number(rawSt.rushing_rushingYards ?? rawSt.rushingYards ?? rawSt.rush_yds ?? 0),
        'RUSH YDS': Number(rawSt.rushing_rushingYards ?? rawSt.rushingYards ?? rawSt.rush_yds ?? 0),
        rec_yds: Number(rawSt.receiving_receivingYards ?? rawSt.receivingYards ?? rawSt.rec_yds ?? 0),
        'REC YDS': Number(rawSt.receiving_receivingYards ?? rawSt.receivingYards ?? rawSt.rec_yds ?? 0),
        rec: Number(rawSt.receiving_receptions ?? rawSt.receptions ?? rawSt.rec ?? 0),
        'REC': Number(rawSt.receiving_receptions ?? rawSt.receptions ?? rawSt.rec ?? 0),
        // Soccer normalized
        goals: Number(rawSt.totalGoals ?? rawSt.goals ?? rawSt.gol ?? 0),
        GOL: Number(rawSt.totalGoals ?? rawSt.goals ?? rawSt.gol ?? 0),
        sot: Number(rawSt.shotsOnTarget ?? rawSt.sot ?? 0),
        SOT: Number(rawSt.shotsOnTarget ?? rawSt.sot ?? 0),
        ga: Number(rawSt.totalGoals ?? rawSt.goals ?? 0) + Number(rawSt.goalAssists ?? rawSt.ast ?? 0),
        'G+A': Number(rawSt.totalGoals ?? rawSt.goals ?? 0) + Number(rawSt.goalAssists ?? rawSt.ast ?? 0),
        fls: Number(rawSt.foulsCommitted ?? rawSt.fouls ?? rawSt.fls ?? 0),
        FLS: Number(rawSt.foulsCommitted ?? rawSt.fouls ?? rawSt.fls ?? 0),
        pas: Number(rawSt.keyPasses ?? rawSt.passes ?? rawSt.pas ?? 0),
        PAS: Number(rawSt.keyPasses ?? rawSt.passes ?? rawSt.pas ?? 0)
      };

      return {
        date: m.kickoff_utc ? new Date(m.kickoff_utc).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : 'Reciente',
        opponent_display: (isHome ? 'vs ' : '@ ') + (opp?.name || opp?.short_name || 'Rival'),
        opponent_logo: opp?.logo_url,
        result: res,
        score: `${myScore ?? 0} - ${oppScore ?? 0}`,
        minutes: r.minutes || rawSt.MIN || rawSt.min || '-',
        stats: normStats
      };
    });

    const markets: PlayerMarketItem[] = sport === 'nba' ? [
      { id: 'PTS', label: 'Puntos', key: 'PTS', column: 'pts' },
      { id: 'REB', label: 'Rebotes', key: 'REB', column: 'reb' },
      { id: 'AST', label: 'Asistencias', key: 'AST', column: 'ast' },
      { id: '3PT', label: 'Triples', key: '3PT', column: 'tpm' }
    ] : (sport === 'nfl' ? [
      { id: 'PASS_YDS', label: 'Yardas Pase', key: 'PASS YDS', column: 'passing_passingYards' },
      { id: 'RUSH_YDS', label: 'Yardas Carrera', key: 'RUSH YDS', column: 'rushing_rushingYards' },
      { id: 'REC_YDS', label: 'Yardas Recep', key: 'REC YDS', column: 'receiving_receivingYards' },
      { id: 'REC', label: 'Recepciones', key: 'REC', column: 'receiving_receptions' },
      { id: 'TD', label: 'Touchdowns', key: 'TD', column: 'touchdowns' }
    ] : [
      { id: 'GOL', label: 'Goles', key: 'GOL', column: 'totalGoals' },
      { id: 'SOT', label: 'Tiros al Arco', key: 'SOT', column: 'shotsOnTarget' },
      { id: 'AST', label: 'Asistencias', key: 'AST', column: 'goalAssists' },
      { id: 'TAR', label: 'Tarjetas', key: 'TAR', column: 'yellowCards' }
    ]);

    const avg5 = this.computePlayerAverages(statsRows.slice(0, 5), sport);
    const avg10 = this.computePlayerAverages(statsRows.slice(0, 10), sport);

    return {
      player: playerBio,
      team: playerBio.team || {},
      sport,
      markets,
      gamelog,
      averages_last_5: avg5,
      averages_last_10: avg10,
      season_totals: avg10
    };
  }

  private async fetchPlayerProfileDirectFromSupabase(playerId: string): Promise<PlayerProfileResponse> {
    const gl = await this.fetchPlayerGamelogDirectFromSupabase(playerId);
    const avg10 = gl.averages_last_10 || {};
    const isNba = gl.sport === 'nba';
    const isNfl = gl.sport === 'nfl';

    const pLabel = isNba ? 'Puntos' : (isNfl ? 'Yardas Pase' : 'Goles');
    const pVal = Number(avg10['PTS'] || avg10['totalGoals'] || avg10['passing_passingYards'] || 0);

    const sLabel = isNba ? 'Rebotes' : (isNfl ? 'Yardas Carrera' : 'Tiros al Arco');
    const sVal = Number(avg10['REB'] || avg10['shotsOnTarget'] || avg10['rushing_rushingYards'] || 0);

    const tLabel = isNba ? 'Asistencias' : (isNfl ? 'Touchdowns' : 'Asistencias');
    const tVal = Number(avg10['AST'] || avg10['goalAssists'] || avg10['touchdowns'] || 0);

    const summary: PlayerSummaryKPIs = {
      games_played: gl.gamelog.length,
      primary_label: pLabel,
      primary_val: pVal,
      secondary_label: sLabel,
      secondary_val: sVal,
      tertiary_label: tLabel,
      tertiary_val: tVal,
      minutes_avg: Number(avg10['minutes'] || avg10['MIN'] || 30),
      top_performance: pVal > 0 ? +(pVal * 1.4).toFixed(1) : 25.0
    };

    const recentMatches: PlayerRecentMatch[] = gl.gamelog.map((g, idx) => {
      const pCount = Number(g.stats?.['PTS'] || g.stats?.['points'] || g.stats?.['totalGoals'] || 0);
      const sCount = Number(g.stats?.['REB'] || g.stats?.['rebounds'] || g.stats?.['shotsOnTarget'] || 0);
      const tCount = Number(g.stats?.['AST'] || g.stats?.['assists'] || g.stats?.['goalAssists'] || 0);

      return {
        match_id: `gamelog_${idx}`,
        date: g.date,
        opponent: g.opponent_display,
        score: g.score,
        minutes: typeof g.minutes === 'number' ? g.minutes : 30,
        stats_display: `${pLabel.slice(0, 3)}: ${pCount} | ${sLabel.slice(0, 3)}: ${sCount} | ${tLabel.slice(0, 3)}: ${tCount}`,
        raw_stats: g.stats
      };
    });

    const primaryVals = gl.gamelog.map(g => Number(g.stats?.['PTS'] || g.stats?.['points'] || g.stats?.['totalGoals'] || 0)).reverse();
    const secondaryVals = gl.gamelog.map(g => Number(g.stats?.['REB'] || g.stats?.['shotsOnTarget'] || g.stats?.['passing_passingYards'] || 0)).reverse();

    const chart: PlayerChartData = {
      labels: gl.gamelog.map(g => g.date).reverse(),
      primary_values: primaryVals,
      secondary_values: secondaryVals,
      primary_label: pLabel,
      secondary_label: sLabel,
      primary_color: '#06b6d4',
      secondary_color: '#10b981',
      radar_labels: ['Anotación', 'Creación', 'Defensa', 'Ritmo', 'Presencia'],
      radar_values: [75, 70, 65, 80, 85]
    };

    return {
      player: gl.player,
      team: gl.team,
      summary,
      recent_matches: recentMatches,
      chart
    };
  }
}
