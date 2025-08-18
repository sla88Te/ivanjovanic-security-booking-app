import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { Booking } from '../../../models/booking.model';
import { Destination } from '../../../models/destination.model';
import { TaskService } from '../../../task.service';
import { WebRequestService } from '../../../web-request.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  bookings: Booking[] = [];
  //private bookingSubscription: Subscription
  _id: Booking[] = [];
  destination: Booking[] = [];
  startDate: Booking[] = [];
  endDate: Booking[] = [];
  numberOfGuests: Booking[] = [];
  name: Booking[] = [];
  lastName : Booking[] = [];
  email : Booking[] = [];
  phoneNumber : Booking[] = [];

  des : Destination[] = [];
  destinations : Destination[] = [];
  description : Destination[] = [];
  //price : Destination[] = [];
  getPrice(destinationName: string): string {
  const match = this.destinations.find(d => d.description === destinationName);
  return match ? `$${match.price}` : 'N/A';
}

  filtersLoaded!: Promise<boolean>;

  selectedBooking!: string;

  public id!: string;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
    private authService: AuthService,
    private webReqService: WebRequestService
  ) {}

  ngOnInit(): void {
    
    this.taskService.getBookings().subscribe((bookings: any) => {
      this.bookings = bookings;
    },
    (err) => {
      if (err.status === 0) {
        console.warn('⚠️ Ignorisana greška zbog lokalnog sertifikata ili mreže');
      } else {
        console.error('❌ Greška pri učitavanju rezervacija:', err);
      }
      this.bookings = [];
    }
  );

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
}
