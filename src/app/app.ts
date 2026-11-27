import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { NavbarComponent } from './core/layout/navbar/navbar';
import { PortfolioAssistantComponent } from './shared/ui/portfolio-assistant/portfolio-assistant';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet, PortfolioAssistantComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor() {
    // Offset anchor scrolling by the floating navbar's height so section
    // headings never land tucked underneath it.
    inject(ViewportScroller).setOffset([0, 96]);
  }
}
