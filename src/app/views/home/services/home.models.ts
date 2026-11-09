export interface MetricKpi {
  label: string;
  value: string;
  sublabel?: string;
  isPositive?: boolean;
}

export interface FeaturedMatchPick {
  id: string;
  sport: 'futbol' | 'nba' | 'nfl';
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  kickoff: string;
  pickTitle: string;
  pickValue: string;
  odds: number;
  probPct: number;
  edgePct: number;
  mu: number;
  sigma: number;
  simulations: number;
  isOfficial: boolean;
  type: 'OFFICIAL_EV' | 'PROB_STATS';
  typeLabel: string;
  analysisSnippet: string;
}

export interface MainMatchCard {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  kickoff: string;
  pickType: string;
  selection: string;
  line?: number;
  odds: number;
  probPct: number;
  edgePct: number;
  type: 'OFFICIAL_EV' | 'PROB_STATS';
  status: 'PENDING' | 'LIVE' | 'FINISHED';
  analysisSnippet: string;
}

export interface HomeDashboardData {
  userGreeting: string;
  dateSubtitle: string;
  metrics: MetricKpi[];
  featuredPicks: FeaturedMatchPick[];
  mainPicks: MainMatchCard[];
}
