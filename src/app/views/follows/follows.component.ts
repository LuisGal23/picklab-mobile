import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditComponent } from '../audit/audit.component';

@Component({
  selector: 'app-mobile-follows',
  standalone: true,
  imports: [CommonModule, AuditComponent],
  template: `
    <app-mobile-audit />
  `
})
export class FollowsComponent {}
