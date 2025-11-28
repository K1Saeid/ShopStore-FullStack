import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,     // ngIf, ngFor
    FormsModule,      // ngModel
    RouterLink,       // routerLink
    DatePipe ,
    PaginationComponent       // date pipe
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  page = 1;
  pageSize = 8;
  orders: any[] = [];
  searchText = '';
 loading = true;
  // modal
  modalOpen = false;
  selectedOrder: any = null;
  selectedStatus = 'Pending';
  

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    
    this.orderService.getAllOrder().subscribe(res => {
      this.orders = res;
      this.loading = false;
    });
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe(res => {
      this.orders = res;
    });
  }

 
  openStatusModal(order: any) {
    this.selectedOrder = order;
    this.selectedStatus = order.status;
    this.modalOpen = true;
  }

  closeStatusModal() {
    this.modalOpen = false;
  }

  saveStatus() {
    this.orderService.updateOrderStatus(this.selectedOrder.id, this.selectedStatus)
      .subscribe(() => {
        this.selectedOrder.status = this.selectedStatus;
        this.modalOpen = false;
      });
  }
// FILTER
  get filteredOrders() {
    if (!this.searchText.trim()) return this.orders;

    const t = this.searchText.toLowerCase();

    return this.orders.filter(o =>
      o.orderNumber.toLowerCase().includes(t) ||
      o.user?.fullName?.toLowerCase().includes(t) ||
      o.status?.toLowerCase().includes(t)
    );
  }
  //Pagination
   get pagedOrders() {
  const start = (this.page - 1) * this.pageSize;
  return this.filteredOrders.slice(start, start + this.pageSize);
}

}
