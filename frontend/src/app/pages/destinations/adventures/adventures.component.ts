import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { Destination } from '../../../models/destination.model';
import { TaskService } from '../../../task.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-adventures',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adventures.component.html',
  styleUrls: ['./adventures.component.scss']
})
export class AdventuresComponent implements OnInit {
  destinations: Destination[] = [];
  adventures: Destination[] = [];

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
          this.adventures = data.filter(d => d.type === 'adventures');
          console.log('🎯 Adventures:', this.adventures);
        } else {
          console.warn('⚠️ Neočekivan odgovor sa servera:', data);
          this.adventures = [];
        }
      },
      error: err => {
          if (err.status === 0) {
            console.warn('⚠️ Ignorisana greška zbog lokalnog sertifikata');
          } else {
            console.error('❌ Prava greška:', err);
          }
          this.adventures = [];
        }
    });
}
}