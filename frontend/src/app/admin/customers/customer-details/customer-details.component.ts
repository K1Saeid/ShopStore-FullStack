import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';
import { AddressService } from '../../../services/address.service';
import { OrderService } from '../../../services/order.service';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';


@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule , FormsModule , PaginationComponent , RouterLink],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent {
  ordersPage = 1;
  ordersPageSize = 5;

  customer: any = null;
  loading = true;
  error = '';
  addresses: any[] = [];
  orders: any[] = [];
  isEditing = false;
  editId: number | null = null;

  addressForm = {
    addressLine: '',
    city: '',
    province: '',
    postalCode: ''
  };
  modalOpen = false;
  deleteModalOpen = false;
  deleteId: number | null = null;



  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private addressService: AddressService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadCustomer(+id);
    }
  }

  loadCustomer(id: number) {
    this.userService.getUserById(id).subscribe(res => {
      this.customer = res;

      this.addressService.getByUserId(id).subscribe((addr: any[]) => {
        this.addresses = addr;
      });

      this.orderService.getOrdersByCustomer(id).subscribe((orders: any[]) => {
        this.orders = orders;
      });

      this.loading = false;
    });
 }
//  startEdit(addr: any) {
//   this.isEditing = true;
//   this.editId = addr.id;

//   this.addressForm = {
//     addressLine: addr.addressLine,
//     city: addr.city,
//     province: addr.province,
//     postalCode: addr.postalCode
//   };
// }

cancelEdit() {
  this.isEditing = false;
  this.editId = null;

  this.addressForm = {
    addressLine: '',
    city: '',
    province: '',
    postalCode: ''
  };
}
deleteAddress(id: number) {
  if (!confirm('Are you sure you want to delete this address?')) return;

  this.addressService.deleteAddress(id).subscribe(() => {
    this.addresses = this.addresses.filter(a => a.id !== id);
  });
}

// saveAddress() {
//   if (!this.addressForm.addressLine) return;

//   const payload = {
//     userId: this.customer.id,
//     ...this.addressForm
//   };

//   if (this.isEditing && this.editId) {

//     // UPDATE
//     this.addressService.updateAddress(this.editId, payload).subscribe(res => {
//       const i = this.addresses.findIndex(a => a.id === this.editId);
//       this.addresses[i] = res;

//       this.cancelEdit();
//     });

//   } else {

//     // ADD NEW
//     this.addressService.addAddress(payload).subscribe(res => {
//       this.addresses.push(res);
//       this.cancelEdit();
//     });

//   }
// }
  openAddModal() {
  this.isEditing = false;
  this.editId = null;

  this.addressForm = {
    addressLine: '',
    city: '',
    province: '',
    postalCode: ''
  };

  this.modalOpen = true;
  }
  startEdit(addr: any) {
  this.isEditing = true;
  this.editId = addr.id;

  this.addressForm = {
    addressLine: addr.addressLine,
    city: addr.city,
    province: addr.province,
    postalCode: addr.postalCode
  };

  this.modalOpen = true;
}

closeModal() {
  this.modalOpen = false;
}
 saveAddress() {
  if (!this.addressForm.addressLine.trim()) return;

  const payload = {
    addressLine: this.addressForm.addressLine,
    city: this.addressForm.city,
    province: this.addressForm.province,
    postalCode: this.addressForm.postalCode,
    isDefault: false
  };

  if (this.isEditing && this.editId) {

    this.addressService.updateAddress(this.editId, payload).subscribe(() => {
      this.loadCustomer(this.customer.id);
      this.closeModal();
    });

  } else {

      this.addressService.addAddress(this.customer.id, payload).subscribe(() => {
      this.loadCustomer(this.customer.id);
      this.closeModal();
    });


  }
}




  openDeleteModal(id: number) {
  this.deleteId = id;
  this.deleteModalOpen = true;
  }

  closeDeleteModal() {
  this.deleteModalOpen = false;
  this.deleteId = null;
  }
  confirmDelete() {
  if (!this.deleteId) return;

  this.addressService.deleteAddress(this.deleteId).subscribe(() => {
    this.loadCustomer(this.customer.id);
    this.closeDeleteModal();
  });
  }
    get paginatedOrders() {
    const start = (this.ordersPage - 1) * this.ordersPageSize;
    return this.orders.slice(start, start + this.ordersPageSize);
  }

}
