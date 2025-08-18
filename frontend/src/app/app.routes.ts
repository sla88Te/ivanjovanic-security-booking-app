import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/user/login/login.component';
import { DestinationsComponent } from './pages/destinations/destinations/destinations.component';
import { CitiesComponent } from './pages/destinations/cities/cities.component';
import { AdventuresComponent } from './pages/destinations/adventures/adventures.component';
import { SummerComponent } from './pages/destinations/summer/summer.component';
import { WinterComponent } from './pages/destinations/winter/winter.component';
import { RegisterComponent } from './pages/user/register/register.component';
import { AdminComponent } from './pages/user/admin/admin.component';
import { ReservationComponent } from './pages/user/reservation/reservation.component';
import { NewDestinationComponent } from './pages/user/admin/new-destination/new-destination.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user/login', component: LoginComponent },
  { path: 'user/register', component: RegisterComponent},
  { path: 'user/admin', component: AdminComponent},
  { path: 'destinations', component: DestinationsComponent},
  { path: 'destinations/cities', component: CitiesComponent},
  { path: 'destinations/adventures', component: AdventuresComponent},
  { path: 'destinations/summer', component: SummerComponent},
  { path: 'destinations/wintering', component: WinterComponent},
  { path: 'destinations/:id', loadComponent: () => 
    import('./pages/destinations/book-now/book-now.component').then(m => m.BookNowComponent)},
  { path: 'user/reservation', component: ReservationComponent},
  { path: 'user/new_destination', component: NewDestinationComponent}
  
];