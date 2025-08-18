import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './gallery/gallery.component';
import { ServicesComponent } from './services/services.component';
import { BannerComponent } from './banner/banner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GalleryComponent, ServicesComponent, BannerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}