import { Injectable, signal } from '@angular/core';
import { BankrollSummary } from './bankroll.models';

@Injectable({
  providedIn: 'root'
})
export class BankrollService {
  private summary = signal<BankrollSummary>({
    currentCapital: 2450.00,
    startingCapital: 1000.00,
    totalProfit: 1450.00,
    roiPct: 14.5,
    winRatePct: 73.0,
    totalBets: 128,
    recommendedUnit: 24.50
  });

  public getSummary() {
    return this.summary.asReadonly();
  }
}
