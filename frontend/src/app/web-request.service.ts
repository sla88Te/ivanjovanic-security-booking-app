import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Booking } from './models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly ROOT_URL = 'https://localhost:3000';
  private bookings: Booking[] = [];
  private bookingsUpdate = new Subject<Booking[]>();

  constructor(private http: HttpClient) {}

  post(uri: string, body: any) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.ROOT_URL}/${uri}`, body, { headers });
  }

  get(uri: string, options?: any) {
  return this.http.get(`${this.ROOT_URL}/${uri}`, options);
}
/*
  post(uri: string, payload: Object) {
    return this.http.post(`${this.ROOT_URL}/destinations/book-now`, payload);
  }
  */
  patch(uri: string, payload: Object) {
    return this.http.patch(`${this.ROOT_URL}/${uri}`, payload)
  }

  getDestination(id: string) {
    return this.http.get(`${this.ROOT_URL}/destinations/${id}`)
  }

  getDestinations(){
    return this.http.get(`${this.ROOT_URL}/destinations`)
  }

  postDestination(uri: string, payload: Object) {
  const token = localStorage.getItem('authToken');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.post(`${this.ROOT_URL}/${uri}`, payload, { headers });
}

uploadPicture(file: File, destination: string) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('destination', destination);
  console.log('📤 Sending image upload request...');
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

return this.http.post(`${this.ROOT_URL}/api/upload-image`, formData, { headers });
}

  getUserData(id: string) {
    return this.http.get(`${this.ROOT_URL}/user/${id}`)
  }

  delete(uri: string) {
  const token = localStorage.getItem('authToken');

  return this.http.delete(`${this.ROOT_URL}/${uri}`, {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
  });
}

  deleteDestination(uri: string) {
  const token = localStorage.getItem('authToken');
  return this.http.delete(`${this.ROOT_URL}/${uri}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

  login(email: string, password: string) {
    return this.http.post(`https://localhost:3000/user/login`, {
      email,
      password
    }, {
        observe: 'response'
      });
  }

  signup(email: string, password: string, name: string, lastName: string, phoneNumber: string) {
    return this.http.post(`https://localhost:3000/user/register`, {
      email,
      password,
      name,
      lastName,
      phoneNumber
    }, {
        observe: 'response'
      });
  }
}