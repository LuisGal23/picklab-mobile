import { Injectable, signal, inject } from '@angular/core';
import { MatchAnalysisDetails, AnalysisTab } from './match-analysis.models';
import { ApiService, MatchDetailResponse } from '../../../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MatchAnalysisService {
  private api = inject(ApiService);

  private activeAnalysis = signal<MatchAnalysisDetails | null>(null);
  public detailResponse = signal<MatchDetailResponse | null>(null);
  public isOpen = signal<boolean>(false);
  public isLoadingDetail = signal<boolean>(false);
  public activeTab = signal<AnalysisTab>('simulacion');
  public historyStack = signal<{ details: MatchAnalysisDetails; detailRes: MatchDetailResponse | null }[]>([]);

  public openAnalysis(details?: Partial<MatchAnalysisDetails>, matchId?: string, sport?: string, league?: string) {
    const id = matchId || details?.matchId || 'match_1';

    const fallback: MatchAnalysisDetails = {
      matchId: id,
      matchTitle: details?.matchTitle || 'Partido Programado',
      league: details?.league || 'Competición Oficial',
      kickoff: details?.kickoff || 'Hoy • Próximo',
      market: details?.market || 'Línea de Mercado Principal',
      targetLine: details?.targetLine ?? 2.5,
      marketOdds: details?.marketOdds ?? 1.88,
      fairOdds: details?.fairOdds ?? 1.62,
      overProbPct: details?.overProbPct ?? 62.4,
      underProbPct: details?.underProbPct ?? 37.6,
      edgePct: details?.edgePct ?? 16.5,
      isOfficialPick: details?.isOfficialPick ?? true,
      isSuspicious: details?.isSuspicious ?? false,
      muML: details?.muML ?? 2.85,
      sigmaML: details?.sigmaML ?? 1.15,
      distributionType: details?.distributionType || 'Normal',
      iterations: details?.iterations || 100000,
      percentiles: details?.percentiles || {
        p10: 1.5,
        p25: 2.2,
        p50: details?.muML ?? 2.85,
        p75: 3.6,
        p90: 4.4
      },
      reasoning: details?.reasoning || [
        'Simulación Monte Carlo de 100,000 iteraciones arroja convergencia estadística con sesgo positivo.',
        'La dispersión σ calculada por ML valida alta consistencia sobre la línea propuesta.'
      ]
    };

    this.activeAnalysis.set({ ...fallback, ...details });
    this.activeTab.set('simulacion');
    this.isOpen.set(true);

    // Fetch live match detail from Supabase/API
    if (id) {
      this.fetchDetail(id, sport, league);
    }
  }

  public openRecentMatch(gameId: string, sport?: string, league?: string) {
    if (!gameId) return;

    // Push current to history stack for back navigation
    const current = this.activeAnalysis();
    if (current) {
      this.historyStack.update(stack => [...stack, { details: current, detailRes: this.detailResponse() }]);
    }

    this.isLoadingDetail.set(true);
    this.api.getMatchDetail(gameId, sport, league).subscribe({
      next: (res) => {
        this.isLoadingDetail.set(false);
        this.detailResponse.set(res);
        const homeName = res.match?.home_team?.name || 'Local';
        const awayName = res.match?.away_team?.name || 'Visita';
        const matchTitle = `${homeName} vs ${awayName}`;

        this.activeAnalysis.set({
          matchId: gameId,
          matchTitle,
          league: res.match?.league_id || 'Competición Oficial',
          kickoff: res.match?.kickoff_utc ? new Date(res.match.kickoff_utc).toLocaleString('es-MX', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Finalizado',
          market: res.picks?.[0]?.market || 'Victoria Local',
          targetLine: 2.5,
          marketOdds: res.picks?.[0]?.odds_used || 1.85,
          fairOdds: 1.65,
          overProbPct: res.match?.prob_home_pct || 55,
          underProbPct: res.match?.prob_away_pct || 45,
          edgePct: 12.0,
          isOfficialPick: true,
          isSuspicious: false,
          muML: 2.8,
          sigmaML: 1.1,
          distributionType: 'Normal',
          iterations: 100000,
          percentiles: { p10: 1.4, p25: 2.1, p50: 2.8, p75: 3.5, p90: 4.2 },
          reasoning: ['Datos históricos de partido auditado cargados.'],
          detailResponse: res
        });
        this.activeTab.set('resumen' as any);
      },
      error: () => {
        this.isLoadingDetail.set(false);
      }
    });
  }

  public goBackRecentMatch(): void {
    const stack = this.historyStack();
    if (stack.length > 0) {
      const prev = stack[stack.length - 1];
      this.historyStack.set(stack.slice(0, stack.length - 1));
      this.activeAnalysis.set(prev.details);
      this.detailResponse.set(prev.detailRes);
    }
  }

  private fetchDetail(matchId: string, sport?: string, league?: string) {
    this.isLoadingDetail.set(true);
    this.api.getMatchDetail(matchId, sport, league).subscribe({
      next: (res) => {
        this.isLoadingDetail.set(false);
        this.detailResponse.set(res);
      },
      error: () => {
        this.isLoadingDetail.set(false);
      }
    });
  }

  public closeAnalysis() {
    this.isOpen.set(false);
    this.historyStack.set([]);
  }

  public getAnalysis() {
    return this.activeAnalysis.asReadonly();
  }
}
