import { Injectable, signal } from '@angular/core';
import { MatchAnalysisDetails } from './match-analysis.models';

@Injectable({
  providedIn: 'root'
})
export class MatchAnalysisService {
  private activeAnalysis = signal<MatchAnalysisDetails | null>(null);
  public isOpen = signal<boolean>(false);

  public openAnalysis(details?: Partial<MatchAnalysisDetails>) {
    const fallback: MatchAnalysisDetails = {
      matchId: details?.matchId || 'match-bar-atm-2026',
      matchTitle: details?.matchTitle || 'Atlético de Madrid vs FC Barcelona',
      league: details?.league || 'LaLiga',
      kickoff: details?.kickoff || 'Today • 3:00 PM',
      market: details?.market || 'Total Goles Más de 2.5',
      targetLine: details?.targetLine ?? 2.5,
      marketOdds: details?.marketOdds ?? 1.88,
      fairOdds: details?.fairOdds ?? 1.60,
      overProbPct: details?.overProbPct ?? 62.4,
      underProbPct: details?.underProbPct ?? 37.6,
      edgePct: details?.edgePct ?? 17.3,
      isOfficialPick: true,
      isSuspicious: false,
      muML: details?.muML ?? 3.12,
      sigmaML: details?.sigmaML ?? 1.25,
      distributionType: 'Normal',
      iterations: 100000,
      percentiles: {
        p10: 1.52,
        p25: 2.28,
        p50: 3.12,
        p75: 3.96,
        p90: 4.72
      },
      reasoning: [
        'Modelo XGBoost proyecta 3.12 goles esperados considerando el ritmo ofensivo reciente de ambos clubes.',
        'La dispersión σ=1.25 calculada por ML indica alta consistencia en líneas de gol superiores a 2.',
        'Simulación Monte Carlo de 100,000 iteraciones arroja un 62.4% de probabilidad de Over frente al 53.2% implícito en la cuota de mercado 1.88.',
        'Ventaja matemática (+EV) del +17.3%, catalogado como PICK OFICIAL cuantitativo.'
      ]
    };

    this.activeAnalysis.set({ ...fallback, ...details });
    this.isOpen.set(true);
  }

  public closeAnalysis() {
    this.isOpen.set(false);
  }

  public getAnalysis() {
    return this.activeAnalysis.asReadonly();
  }
}
