import { Injectable, signal } from '@angular/core';
import { ScheduleMatch, DaySchedule } from './schedule.models';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private scheduleList = signal<DaySchedule[]>([
    {
      dateLabel: 'Hoy, 9 Nov',
      isToday: true,
      matches: [
        {
          id: 'sc-1',
          sport: 'soccer',
          league: 'LaLiga EA Sports',
          homeTeam: 'Atlético de Madrid',
          awayTeam: 'FC Barcelona',
          timeCdmx: '15:00',
          venue: 'Cívitas Metropolitano',
          homeOdds: 2.70,
          drawOdds: 3.40,
          awayOdds: 2.55,
          hasMonteCarlo: true,
          modelProbHome: 34.2,
          modelProbAway: 41.5
        },
        {
          id: 'sc-2',
          sport: 'soccer',
          league: 'Premier League',
          homeTeam: 'Arsenal FC',
          awayTeam: 'Chelsea FC',
          timeCdmx: '11:30',
          venue: 'Emirates Stadium',
          homeOdds: 1.85,
          drawOdds: 3.80,
          awayOdds: 4.20,
          hasMonteCarlo: true,
          modelProbHome: 58.4,
          modelProbAway: 21.2
        },
        {
          id: 'sc-3',
          sport: 'nba',
          league: 'NBA Regular Season',
          homeTeam: 'Boston Celtics',
          awayTeam: 'Miami Heat',
          timeCdmx: '19:00',
          venue: 'TD Garden',
          homeOdds: 1.45,
          awayOdds: 2.85,
          hasMonteCarlo: true,
          modelProbHome: 71.0,
          modelProbAway: 29.0
        }
      ]
    },
    {
      dateLabel: 'Mañana, 10 Nov',
      isToday: false,
      matches: [
        {
          id: 'sc-4',
          sport: 'soccer',
          league: 'UEFA Champions League',
          homeTeam: 'Real Madrid',
          awayTeam: 'Bayern München',
          timeCdmx: '14:00',
          venue: 'Santiago Bernabéu',
          homeOdds: 2.10,
          drawOdds: 3.60,
          awayOdds: 3.20,
          hasMonteCarlo: true,
          modelProbHome: 49.5,
          modelProbAway: 27.5
        }
      ]
    }
  ]);

  public getSchedule() {
    return this.scheduleList.asReadonly();
  }
}
