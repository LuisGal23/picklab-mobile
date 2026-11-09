export interface MetricKpi {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface FeaturedMatchPick {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
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
}

export interface MainMatchCard {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  pickType: string;
  line?: number;
  odds: number;
  probPct: number;
  edgePct: number;
  status: 'PENDING' | 'LIVE' | 'FINISHED';
}

export interface HomeDashboardData {
  userGreeting: string;
  dateSubtitle: string;
  metrics: MetricKpi[];
  featuredPick: FeaturedMatchPick;
  mainPicks: MainMatchCard[];
}
