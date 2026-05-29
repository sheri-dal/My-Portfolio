import { Routes } from '@angular/router';
import { HeroIntroComponent } from './features/home/hero-intro.component';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: HeroIntroComponent,
	},
];
