import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-mobile-bankroll',
  standalone: true,
  imports: [CommonModule, SettingsComponent],
  template: `
    <app-mobile-settings />
  `
})
export class BankrollComponent {}
