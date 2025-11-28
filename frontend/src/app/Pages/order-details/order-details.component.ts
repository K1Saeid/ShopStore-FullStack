import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { NgIf, NgForOf, NgStyle, NgClass } from '@angular/common';
import { CommonModule, DatePipe } from '@angular/common'; 
import { Router } from '@angular/router';

@Component({
  
  standalone: true,
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  imports:[NgForOf,CommonModule, DatePipe]
})
export class OrderDetailsComponent {

  order: any;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.orderService.getOrderDetails(id).subscribe(res => {
      this.order = res;
    });
  }
  goBack() {
  this.router.navigate(['/account/profile'], { queryParams: { tab: 'orders' } });
}

}
