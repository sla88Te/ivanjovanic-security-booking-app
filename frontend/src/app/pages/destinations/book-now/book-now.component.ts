import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../../auth.service';
import { Booking } from '../../../models/booking.model';
import { Destination } from '../../../models/destination.model';
import { TaskService } from '../../../task.service';
import { WebRequestService } from '../../../web-request.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-now',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './book-now.component.html',
  styleUrls: ['./book-now.component.css']
})
export class BookNowComponent implements OnInit {

  bookings: Booking[] = [];
  destination: Booking[] = [];
  startDate: Booking[] = [];
  endDate: Booking[] = [];
  numberOfGuests: Booking[] = [];

  des: Destination[] = [];
  destinations: Destination[] = [];
  type: Destination[] = [];
  description: Destination[] = [];
  price: Destination[] = [];

  destinationDetails!: Destination;
  filtersLoaded!: Promise<boolean>;

  public id!: string;
  public name!: string;
  public lastName!: string;
  public email!: string;
  public phoneNumber!: string;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService,
    private webReqService: WebRequestService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getUserIdFromToken(): string | null {
  if (isPlatformBrowser(this.platformId)) {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;

      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload || !payload.id) return null;

      return payload.id;
    } catch (e) {
      console.error('❌ Failed to parse authToken:', e);
      return null;
    }
  }
  return null;
}

  async ngOnInit(): Promise<void> {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      //console.warn('⚠️ No user ID found in token');
      return;
    }
    this.id = userId;

    this.webReqService.getUserData(userId).subscribe((user: any) => {
      this.name = user.name;
      this.lastName = user.lastName;
      this.phoneNumber = user.phoneNumber;
      this.email = user.email;

      //console.log('✅ user.id:', userId);
      //console.log('✅ user.lastName:', user.lastName);
    });

    this.taskService.getBookings().subscribe((bookings: any) => {
      this.bookings = bookings;
    });

    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.taskService.getDestinationT(params['id']).subscribe(() => {
          this.router.navigate(['/destinations', params['id']]);

          this.taskService.getDes(params['id']).subscribe((des: any) => {
            this.des = des;
            this.destinations = des.destinations;
            this.description = des.description;
            this.price = des.price;
            this.filtersLoaded = Promise.resolve(true);
          });
        });
      } else {
        this.des = [];
      }
    });
  }

  createBooking(destination: string, startDate: string, endDate: string, numberOfGuests: string) {
    console.log('📤 Booking request triggered');

    this.taskService.createBooking(
      destination,
      startDate,
      endDate,
      numberOfGuests,
      this.name,
      this.lastName,
      this.email,
      this.phoneNumber
    ).subscribe({
      next: (response: any) => {
        //console.log('✅ Booking successful:', response);
        alert('Rezervacija uspešno kreirana!');
        this.router.navigate(['/user/reservation']);
      },
      error: (err) => {
        console.error('❌ Booking failed:', err);
        alert('Greška prilikom rezervacije. Pokušajte ponovo.');
      }
    });
  }
}
