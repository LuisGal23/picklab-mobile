import { Injectable, inject } from '@angular/core';
import { SettingsService } from '../../../core/services/settings.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsViewService {
  public coreSettings = inject(SettingsService);
}
