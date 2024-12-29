import { Routes } from '@angular/router';
import { SearchComponent } from './core/pages/search/search.component';
import { SummaryComponent } from './core/pages/summary/summary.component';

export const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'summary', component: SummaryComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' }
];
