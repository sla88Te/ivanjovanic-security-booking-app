import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, Params } from '@angular/router';
import { AuthService } from '../auth.service';
import { WebRequestService } from '../web-request.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userEmail!: string;
  isLoggedIn = false;
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  this.authService.loggedIn$.subscribe(val => this.isLoggedIn = val);
  this.authService.userEmail$.subscribe(email => this.userEmail = email ?? '');
  this.authService.isAdmin$.subscribe(admin => this.isAdmin = admin);
}
  onClickLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

