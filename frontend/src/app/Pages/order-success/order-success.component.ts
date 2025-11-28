import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent {

  countdown = 7; // ثانیه
  interval: any;
  

  constructor(private router: Router) {}

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        clearInterval(this.interval);
        this.router.navigate(['/']); // ★ انتقال خودکار به Home
      }

    }, 1000);
    
  }
  
  
}
