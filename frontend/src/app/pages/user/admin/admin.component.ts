import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { Booking } from '../../../models/booking.model';
import { Destination } from '../../../models/destination.model';
import { TaskService } from '../../../task.service';
import { WebRequestService } from '../../../web-request.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public userEmail!: string;

  bookings: Booking[] = [];

  
  des : Destination[] = [];
  destinations : Destination[] = [];
  type : Destination[] = [];
  description : Destination[] = [];
  price : Destination[] = [];

  filtersLoaded!: Promise<boolean>;

  selectedBooking!: string;
  booking!: Booking[];

  public id!: string;


  showBooking!: boolean;
  showDestination!: boolean;

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router, private authService: AuthService, private webReqService: WebRequestService, @Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit() {
    this.authService.isAdmin$.subscribe((isAdmin) => {
      if (!isAdmin) {
        this.router.navigate(['/']);

        if (isPlatformBrowser(this.platformId)) {
          window.location.reload(); // samo ako smo u browseru
        }
      }
    });
}

  onclickGetBookings(){
    this.taskService.getBookings().subscribe((bookings : any) => {
      this.bookings = bookings;
      this.showBooking = true;
      this.showDestination = false;
    },
    (err) => {
      console.error('❌ Greška pri učitavanju rezervacija:', err);
      this.bookings = [];
    })
  }

  onClickDestinations(){
    this.taskService.getDestinations().subscribe((destinations : any) => {
      this.des = destinations;
      this.showDestination = true;
      this.showBooking = false;
    })
  }

  deleteDestination(id: string) {
  this.taskService.deleteDestination(id).subscribe(() => {
    this.des = this.des.filter(val => val.id !== id);
  });
}

  deleteBooking(id: string): void {
    this.taskService.deleteBooking(id).subscribe(
      () => {
        this.bookings = this.bookings.filter(b => b.id !== id);
      },
      (err) => {
        if (err.status === 0) {
          console.warn('⚠️ Ignorisana greška pri brisanju zbog lokalnog sertifikata');
        } else {
          console.error('❌ Greška pri brisanju rezervacije:', err);
        }
      }
    );
  }

  goToNewDestination() {
    this.router.navigate(['/user/new_destination']);
  }
}
