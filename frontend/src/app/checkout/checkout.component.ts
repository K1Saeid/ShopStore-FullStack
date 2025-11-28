import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  user: any;
  cart: any = { items: [], totalPrice: 0 };

  orderData = {
    fullName: '',
    address: '',
    city: '',
    postalCode: ''
  };

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private orderService: OrderService,
    private router: Router ,
    private http: HttpClient   // ⬅ لازم بود اضافه کنیم
  ) {}

  ngOnInit() {
    this.user = this.userService.getCurrentUser();

    this.cartService.getCart(this.user.id).subscribe((res: any) => {
      this.cart = res;
    });
  }
placeOrder() {
  if (!this.orderData.fullName || !this.orderData.address ||
      !this.orderData.city || !this.orderData.postalCode) {
    alert("Please fill all fields!");
    return;
  }

  const orderPayload = {
    userId: this.user.id,
    totalPrice: this.cart.totalPrice,
    items: this.cart.items.map((x: any) => ({
      productId: x.productId,
      quantity: x.quantity,
      size: x.size,
      color: x.color,
      price: x.price
    }))
  };

  this.orderService.placeOrder(orderPayload).subscribe({
  next: () => {

    this.cartService.clearCart(this.user.id).subscribe(() => {
      this.cartService.setCartCount(0);
    });

    this.router.navigate(['/order-success']);
  },
  error: (err) => {
    console.log("ORDER ERROR:", err);
    alert("Something went wrong creating your order.");
  }
});


}



}
