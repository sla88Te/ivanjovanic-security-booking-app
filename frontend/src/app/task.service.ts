import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { Booking } from './models/booking.model';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private bookingUpdate = new Subject<Booking[]>()

  constructor(private webReqService: WebRequestService, private authService: AuthService) {
    if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) {
          authService.setLoginState(token);
        }
      }
   }

  getBookings() {
    const headers = this.authService.getAuthHeaders();
    return this.webReqService.get('booking', { headers });
}

  getBookingUpdateListener(){
    return this.bookingUpdate.asObservable()
  }

  getBookingsById(id: string){
    return this.webReqService.get(`booking/${id}`)
  }
/*
  getUser() {
    return this.authService.getUserId();
  }
*/
  getToken(): string | null {
    if (typeof window === 'undefined') {
    return null; // ili fallback vrednost
  }
  return localStorage.getItem('authToken');
}

getUser(): any {
  if (typeof window !== 'undefined' && window.localStorage) {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

getUserId(): string {
  const user = this.getUser();
  return user?.id ?? '';
}

getUserEmail(): string {
  return this.getUser()?.email;
}

  getDestinationT(id: string){
    return this.webReqService.getDestination(id);
  }

  getDes(id: string){
    return this.webReqService.get(`destinations/${id}`);
  }

  getDestinations(){
    return this.webReqService.getDestinations();
  }

  createDestination(destinations: string, type: string, description: string, price: string){
    return this.webReqService.postDestination('destinations/', {
        destinations,
        type,
        description,
        price
    });
    }

  deleteDestination(id: string){
    return this.webReqService.deleteDestination(`destinations/${id}`);
  }
  

  createBooking(destination: string, startDate: string, endDate: string, numberOfGuests: string,
    name: string, lastName: string, email: string, phoneNumber: string) {
         console.log('📤 Booking request triggered');
        return this.webReqService.post('destinations/book-now/', {
            destination,
            startDate,
            endDate,
            numberOfGuests,
            name,
            lastName,
            email,
            phoneNumber
        });
    }

  deleteBooking(id: string) {
    return this.webReqService.delete(`booking/${id}`);
  }

  updateBooking(id: string, destination: string){
    return this.webReqService.patch(`booking/${id}`, { destination });
  }
}