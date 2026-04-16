import { Routes } from '@angular/router';

import { Absence } from './pages/absence/absence';
import { Settings } from './pages/settings/settings';
import { UserList } from './pages/user-list/user-list';
import { authGuard, guestGuard } from './core/guards';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserList, canActivate: [authGuard] },
  { path: 'absence', component: Absence, canActivate: [authGuard] },
  { path: 'settings', component: Settings, canActivate: [guestGuard] },
];
