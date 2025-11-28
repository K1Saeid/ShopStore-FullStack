import { Component } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {  NgForOf } from '@angular/common';
import { CommonModule, DatePipe } from '@angular/common'; 
@Component({
  selector: 'app-admin-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  imports:[NgForOf,CommonModule, DatePipe]
})
export class AdminOrderDetailsComponent {

  order: any;
  apiUrl = `${environment.apiBaseUrl}/Order`;

  //
  fromPage: string | null = null;
  customerId: number | null = null;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
    this.fromPage = params['from'] || null;
    this.customerId = params['customerId'] ? Number(params['customerId']) : null;
  });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getOrderDetails(id);
  }

  getOrderDetails(id: number) {
    this.http.get(`${this.apiUrl}/details/${id}`).subscribe({
      next: (res) => this.order = res,
      error: (err) => console.error('Order Details Error:', err)
    });
  }
  goBack() {

    if (this.fromPage === 'customer' && this.customerId) {
      this.router.navigate(['/admin/customers', this.customerId]);
      return;
    }

    if (this.fromPage === 'orders') {
      this.router.navigate(['/admin/orders']);
      return;
    }
    if (this.fromPage === 'dashboard') {
      this.router.navigate(['/admin/dashboard']);
      return;
    }
    // fallback
    this.router.navigate(['/admin/orders']);
  }


}
