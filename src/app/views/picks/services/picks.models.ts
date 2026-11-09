export type PickTier = 'oficial' | 'probable' | 'sospechoso';
export type PickSport = 'all' | 'soccer' | 'nba' | 'nfl';

export interface MobilePickItem {
  id: string;
  tier: PickTier;
  sport: 'soccer' | 'nba' | 'nfl';
  league: string;
  matchTitle: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  kickoff: string;
  selection: string;
  odds: number;
  probModelPct: number;
  edgePct: number;
  simulations: number;
  mu: number;
  sigma: number;
  analysisSnippet: string;
  isSuspicious: boolean;
  suspiciousReason?: string;
}
