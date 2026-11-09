export type PickTier = 'oficial' | 'probable' | 'sospechoso';

export interface MobilePickItem {
  id: string;
  tier: PickTier;
  sport: 'soccer' | 'nba' | 'nfl';
  league: string;
  matchTitle: string;
  kickoff: string;
  selection: string;
  odds: number;
  probModelPct: number;
  edgePct: number;
  simulations: number;
  isSuspicious: boolean;
  suspiciousReason?: string;
}
