import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationsRoutingModule } from './destinations-routing.module';

//import { AdventuresComponent } from './adventures/adventures.component';
//import { BookNowComponent } from './book-now/book-now.component';
import { CitiesComponent } from './cities/cities.component';
import { DestinationsComponent } from './destinations/destinations.component';
import { AdventuresComponent } from './adventures/adventures.component';
import { SummerComponent } from './summer/summer.component';
//import { WinterComponent } from './winter/winter.component';

@NgModule({
  declarations: [
    //AdventuresComponent,
    //BookNowComponent,
    //CitiesComponent,
    //DestinationsComponent,
    //SummerComponent,
    //WinterComponent,
  ],
  imports: [
    CommonModule, 
    DestinationsRoutingModule, 
    DestinationsComponent,
    CitiesComponent,
    AdventuresComponent,
    SummerComponent
    ],
})
export class DestinationsModule {}
