import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full'},
  { path: 'destinations', loadChildren: () => import('./pages/destinations/destinations.module').then(m => m.DestinationsModule) },
  { path: 'user', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }