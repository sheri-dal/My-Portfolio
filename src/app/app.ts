import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/layout/navbar/navbar';
import { PortfolioAssistantComponent } from './shared/ui/portfolio-assistant/portfolio-assistant';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet, PortfolioAssistantComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
