export type AuditTier = 'all' | 'oficial' | 'probable' | 'sospechoso';
export type AuditSport = 'all' | 'futbol' | 'nba' | 'nfl';
export type AuditStatus = 'WON' | 'LOST' | 'VOID' | 'PENDING';

export interface AuditRecord {
  id: string;
  sport: 'futbol' | 'nba' | 'nfl';
  league: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  selection: string;
  odds: number;
  tier: 'oficial' | 'probable' | 'sospechoso';
  status: AuditStatus;
  resultScore: string;
  profitUnits: number;
  sha256Hash: string;
  clvEdgePct: number;
  settledAt: string;
}

export interface AuditMetricsSummary {
  totalAudited: number;
  winRatePct: number;
  roiPct: number;
  profitUnits: number;
  averageOdds: number;
  brierCalibration: number;
}
