import { MatchDetailResponse, Match, PlayerMatchStatsItem, TeamRecentForm, H2HSummary, PickItem } from '../../../../../core/services/api.service';

export type AnalysisTab = 'simulacion' | 'picks' | 'stats' | 'jugadores' | 'forma';

export interface SimulationPercentiles {
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

export interface MatchAnalysisDetails {
  matchId: string;
  matchTitle: string;
  league: string;
  kickoff: string;
  market: string;
  targetLine: number;
  marketOdds: number;
  fairOdds: number;
  overProbPct: number;
  underProbPct: number;
  edgePct: number;
  isOfficialPick: boolean;
  isSuspicious: boolean;
  muML: number;
  sigmaML: number;
  distributionType: 'Normal' | 'Poisson' | 'Lognormal';
  iterations: number;
  percentiles: SimulationPercentiles;
  reasoning: string[];
  // Rich data
  detailResponse?: MatchDetailResponse;
}
