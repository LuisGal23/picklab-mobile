import { Injectable, signal, computed, inject } from '@angular/core';
import { HomeDashboardData, FeaturedMatchPick, MainMatchCard, MetricKpi } from './home.models';
import { LoginService } from '../../auth/login/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private loginService = inject(LoginService);

  public featuredIndex = signal<number>(0);

  private readonly featuredPicksList: FeaturedMatchPick[] = [
    {
      id: 'm1_ars_che',
      sport: 'futbol',
      league: 'Premier League',
      homeTeam: 'Arsenal FC',
      awayTeam: 'Chelsea FC',
      homeLogo: 'https://crests.football-data.org/57.png',
      awayLogo: 'https://crests.football-data.org/61.png',
      kickoff: 'Hoy • 20:00 UTC',
      pickTitle: 'Over 2.5 Goles',
      pickValue: 'Más de 2.5 goles totales',
      odds: 1.88,
      probPct: 62.4,
      edgePct: 18.4,
      mu: 3.12,
      sigma: 1.15,
      simulations: 100000,
      isOfficial: true,
      type: 'OFFICIAL_EV',
      typeLabel: 'PICK OFICIAL (+EV)',
      analysisSnippet: 'Simulación Monte Carlo detecta convergencia en 3.12 goles esperados con 18.4% de valor sobre la cuota de mercado.'
    },
    {
      id: 'm2_rma_bar',
      sport: 'futbol',
      league: 'La Liga EA Sports',
      homeTeam: 'Real Madrid',
      awayTeam: 'FC Barcelona',
      homeLogo: 'https://crests.football-data.org/86.png',
      awayLogo: 'https://crests.football-data.org/81.png',
      kickoff: 'Hoy • 21:00 UTC',
      pickTitle: 'Ambos Equipos Anotan',
      pickValue: 'BTTS: Sí',
      odds: 1.75,
      probPct: 71.8,
      edgePct: 14.2,
      mu: 2.85,
      sigma: 0.95,
      simulations: 100000,
      isOfficial: true,
      type: 'OFFICIAL_EV',
      typeLabel: 'PICK OFICIAL (+EV)',
      analysisSnippet: 'Gasto ofensivo combinado >4.1 xG en los últimos 5 partidos directos. Algoritmo proyecta alta probabilidad de gol mutuo.'
    },
    {
      id: 'm3_lal_gsw',
      sport: 'nba',
      league: 'NBA Basketball',
      homeTeam: 'LA Lakers',
      awayTeam: 'GS Warriors',
      homeLogo: 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
      awayLogo: 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg',
      kickoff: 'Hoy • 22:30 UTC',
      pickTitle: 'Lakers +3.5 Spread',
      pickValue: 'Hándicap Lakers +3.5',
      odds: 1.95,
      probPct: 58.7,
      edgePct: 9.8,
      mu: 114.5,
      sigma: 8.2,
      simulations: 100000,
      isOfficial: false,
      type: 'PROB_STATS',
      typeLabel: 'PROBABLE POR STATS',
      analysisSnippet: 'Tendencia estadística pura: Lakers cubren el spread en 8 de sus últimos 10 juegos como locales con ventaja de descanso.'
    },
    {
      id: 'm4_kc_buf',
      sport: 'nfl',
      league: 'NFL Football',
      homeTeam: 'Kansas City Chiefs',
      awayTeam: 'Buffalo Bills',
      homeLogo: 'https://static.www.nfl.com/image/private/f_auto/league/ujshjqvmnxce8m4obm9y',
      awayLogo: 'https://static.www.nfl.com/image/private/f_auto/league/giphcy6ie9mxoxldntso',
      kickoff: 'Hoy • 23:15 UTC',
      pickTitle: 'Over 47.5 Puntos',
      pickValue: 'Total Over 47.5',
      odds: 1.92,
      probPct: 56.9,
      edgePct: 8.5,
      mu: 51.4,
      sigma: 6.8,
      simulations: 100000,
      isOfficial: false,
      type: 'PROB_STATS',
      typeLabel: 'PROBABLE POR STATS',
      analysisSnippet: 'Eficiencia en zona roja superior al 68%. Ritmo de juego ofensivo proyecta intercambio de posesiones de alta puntuación.'
    }
  ];

  private readonly mainPicksList: MainMatchCard[] = [
    {
      id: 'mp1',
      sport: 'Fútbol',
      league: 'Premier League',
      homeTeam: 'Liverpool FC',
      awayTeam: 'Manchester City',
      homeLogo: 'https://crests.football-data.org/64.png',
      awayLogo: 'https://crests.football-data.org/65.png',
      kickoff: 'Hoy • 17:30 UTC',
      pickType: 'Ganador (1X2)',
      selection: 'Liverpool o Empate (1X)',
      odds: 1.62,
      probPct: 69.5,
      edgePct: 12.3,
      type: 'OFFICIAL_EV',
      status: 'PENDING',
      analysisSnippet: 'Inmictos en Anfield en 14 cotejos. Disparidad de cuotas ofrece valor matemático sólido.'
    },
    {
      id: 'mp2',
      sport: 'NBA',
      league: 'NBA Basketball',
      homeTeam: 'Boston Celtics',
      awayTeam: 'Miami Heat',
      homeLogo: 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
      awayLogo: 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg',
      kickoff: 'Hoy • 19:00 UTC',
      pickType: 'Moneyline',
      selection: 'Boston Celtics ML',
      odds: 1.55,
      probPct: 73.2,
      edgePct: 15.6,
      type: 'OFFICIAL_EV',
      status: 'PENDING',
      analysisSnippet: 'Celtics tienen +11.2 de rating ofensivo en casa. Simulación de 100k iteraciones muestra victoria en el 73.2% de los casos.'
    },
    {
      id: 'mp3',
      sport: 'Fútbol',
      league: 'Serie A',
      homeTeam: 'Inter Milan',
      awayTeam: 'Juventus FC',
      homeLogo: 'https://crests.football-data.org/108.png',
      awayLogo: 'https://crests.football-data.org/109.png',
      kickoff: 'Hoy • 20:45 UTC',
      pickType: 'Goles Totales',
      selection: 'Under 2.5 Goles',
      odds: 1.82,
      probPct: 61.0,
      edgePct: 8.7,
      type: 'PROB_STATS',
      status: 'PENDING',
      analysisSnippet: 'Defensas top 2 de la liga italiana con menos de 0.8 xGA por 90 minutos.'
    }
  ];

  constructor() {
    // Auto-advance carousel every 5 seconds
    setInterval(() => {
      this.featuredIndex.update(idx => (idx + 1) % this.featuredPicksList.length);
    }, 5000);
  }

  public getDashboardData = computed<HomeDashboardData>(() => {
    const user = this.loginService.currentSession()?.user;
    const name = user?.name || 'Luis';

    // Format localized date: "Lunes, 9 de Noviembre de 2026"
    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    const metrics: MetricKpi[] = [
      {
        label: 'Picks Oficiales EV',
        value: '6',
        sublabel: '+15.2% Edge medio',
        isPositive: true
      },
      {
        label: 'Cuota Promedio',
        value: '@1.85',
        sublabel: 'Rango 1.62 - 2.10'
      },
      {
        label: 'Win Rate Auditado',
        value: '68.4%',
        sublabel: 'Últimos 150 picks',
        isPositive: true
      }
    ];

    return {
      userGreeting: `Bienvenido, ${name}`,
      dateSubtitle: capitalizedDate,
      metrics,
      featuredPicks: this.featuredPicksList,
      mainPicks: this.mainPicksList
    };
  });

  public getCurrentFeaturedPick = computed<FeaturedMatchPick>(() => {
    const list = this.featuredPicksList;
    const idx = this.featuredIndex();
    return list[idx % list.length];
  });

  public selectFeatured(index: number): void {
    this.featuredIndex.set(index);
  }
}
