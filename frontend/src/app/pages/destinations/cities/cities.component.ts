import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { Destination } from '../../../models/destination.model';
import { TaskService } from '../../../task.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  destinations: Destination[] = [];
  cities: Destination[] = [];

  userEmail!: string;
  isLoggedIn = false;

  constructor(private authService: AuthService, private taskService: TaskService, private http: HttpClient) {}

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
    this.http.get<Destination[]>('https://localhost:3000/destinations')
      .subscribe({
        next: data => {
          if (Array.isArray(data)) {
            this.cities = data.filter(d => d.type === 'city');
            console.log('Fetched cities:', this.cities);
          } else {
            console.warn('Unexpected response:', data);
            this.cities = [];
          }
        },
        error: err => {
          if (err.status === 0) {
            console.warn('⚠️ Ignorisana greška zbog lokalnog sertifikata');
          } else {
            console.error('❌ Prava greška:', err);
          }
          this.cities = [];
        }
      });
  }
}
