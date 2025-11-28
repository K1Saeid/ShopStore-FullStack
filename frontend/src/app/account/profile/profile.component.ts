import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/auth.service';
import { AddressService } from '../../services/address.service';
import { OrderService } from '../../services/order.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { RouterLink , ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule,PaginationComponent,RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  user: any = {};
  profileMessage = '';

  addresses: any[] = [];
  orders: any[] = [];

  //
  activeTab = 'profile';


  newAddress = {
    userId: 0,
    addressLine: '',
    city: '',
    province: '',
    postalCode: '',
    isDefault: false
  };
  orderPage = 1;
  orderPageSize = 5;

  constructor(
    public route: ActivatedRoute,
    private userService: UserService,
    private addressService: AddressService,
    private orderService: OrderService
  ) {}

 ngOnInit() {
  this.route.queryParams.subscribe(params => {
    const tab = params['tab'];

    if (tab) {
      this.activeTab = tab;
    }
  });

  this.userService.currentUser$.subscribe(user => {
    if (user) {
      this.user = user;
      this.loadOrders();
    }
  });
}


  // --------------------------
  // PROFILE
  // --------------------------
  saveProfile() {
    this.userService.updateProfile(this.user.id, {
      fullName: this.user.fullName,
      phone: this.user.phone
    }).subscribe(() => {
      this.profileMessage = "Profiel succesvol bijgewerkt!";
    });
  }

  // --------------------------
  // ADDRESSES
  // --------------------------
  loadAddresses() {
    this.addressService.getByUserId(this.user.id).subscribe(res => {
      this.addresses = res;
    });
  }

      addAddress() {
      const data = {
        addressLine: this.newAddress.addressLine,
        city: this.newAddress.city,
        province: this.newAddress.province,
        postalCode: this.newAddress.postalCode,
        isDefault: false
      };

      this.addressService.addAddress(this.user.id, data).subscribe(() => {
        this.loadAddresses();
      });
    }


  deleteAddress(id: number) {
    this.addressService.deleteAddress(id).subscribe(() => {
      this.loadAddresses();
    });
  }

  // --------------------------
  // ORDERS
  // --------------------------
    loadOrders() {
    this.orderService.getOrdersByCustomer(this.user.id).subscribe(res => {
      this.orders = res;
    });
  }




get pagedOrders() {
  const start = (this.orderPage - 1) * this.orderPageSize;
  return this.orders.slice(start, start + this.orderPageSize);
}

}
