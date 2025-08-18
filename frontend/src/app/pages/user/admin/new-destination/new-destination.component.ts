import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../auth.service';
import { TaskService } from '../../../../task.service';
import { WebRequestService } from '../../../../web-request.service';
import { HttpHeaders } from '@angular/common/http';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-new-destination',
  templateUrl: './new-destination.component.html',
  styleUrls: ['./new-destination.component.css']
})
export class NewDestinationComponent implements OnInit {

  selectedFile: File | null = null;

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router, private authService: AuthService, private webReqService: WebRequestService) { }

  ngOnInit(): void {
  }


onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'jpg') {
      alert('⚠️ Only .jpg files are allowed!');
      return;
    }
    this.selectedFile = file;
  }
}

createDestination(destinations: string, type: string, description: string, price: string): void {
  if (!this.selectedFile) {
    alert('⚠️ Please select a .jpg image!');
    return;
  }

  this.webReqService.uploadPicture(this.selectedFile, destinations).pipe(
    switchMap(() => this.taskService.createDestination(destinations, type, description, price))
  ).subscribe({
    next: (response: any) => {
      console.log('✅ Destination created:', response);
      this.router.navigate(['/user/admin']);
    },
    error: err => {
      console.error('❌ Error creating destination:', err);
      alert('Greška pri kreiranju destinacije.');
    }
  });
}

}

/*
createDestination(destinations: string, type: string, description: string, price: string) { console.log('📤 Sending:', { destinations, type, description, price }); this.taskService.createDestination(destinations, type, description, price) .subscribe({ next: (response: any) => { console.log('✅ Destination created:', response); this.router.navigate(['/user/admin']); }, error: err => { console.error('❌ Error creating destination:', err); // možeš dodati alert ili toast ovde } }); }
*/
