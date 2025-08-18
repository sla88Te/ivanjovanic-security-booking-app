import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdventuresComponent } from './adventures/adventures.component';
import { CitiesComponent } from './cities/cities.component';
import { DestinationsComponent } from './destinations/destinations.component';
import { SummerComponent } from './summer/summer.component';
import { WinterComponent } from './winter/winter.component';
import { BookNowComponent } from './book-now/book-now.component';

const routes: Routes = [
  { path: '', component: DestinationsComponent },
  { path: 'adventures', component: AdventuresComponent },
  { path: ':id', component: BookNowComponent },
  { path: 'cities', component: CitiesComponent },
  { path: 'summer', component: SummerComponent },
  { path: 'wintering', component: WinterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DestinationsRoutingModule {}
