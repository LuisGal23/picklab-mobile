export interface ScheduleMatch {
  id: string;
  sport: 'soccer' | 'nba' | 'nfl';
  league: string;
  homeTeam: string;
  awayTeam: string;
  timeCdmx: string;
  venue: string;
  homeOdds: number;
  drawOdds?: number;
  awayOdds: number;
  hasMonteCarlo: boolean;
  modelProbHome: number;
  modelProbAway: number;
}

export interface DaySchedule {
  dateLabel: string;
  isToday: boolean;
  matches: ScheduleMatch[];
}
