export type SportFilterType = 'all' | 'futbol' | 'nba' | 'nfl';

export interface DayMatchItem {
  id: string;
  sport: 'futbol' | 'nba' | 'nfl';
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  kickoffDate: string; // YYYY-MM-DD
  kickoffTime: string; // e.g. "20:00"
  status: 'PRE_MATCH' | 'LIVE' | 'FINISHED';
  scoreHome?: number;
  scoreAway?: number;
  period?: string;
  // Probabilidades Monte Carlo sin margen (como en la web)
  probHome: number;
  probDraw?: number;
  probAway: number;
  // Cuotas de mercado DraftKings / Pinnacle
  homeOdds: number;
  drawOdds?: number;
  awayOdds: number;
  // Pick Oficial o Probable por stats
  isOfficialPick: boolean;
  isProbableByStats: boolean;
  pickTitle?: string;
  pickSelection?: string;
  pickOdds?: number;
  edgePct?: number;
  // Data de simulación para el modal de análisis
  mu?: number;
  sigma?: number;
  simulations?: number;
  analysisSnippet?: string;
}
