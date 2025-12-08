import { Component, Input, OnInit , ViewChild, ElementRef } from '@angular/core';
import { NgIf, NgForOf, NgStyle, NgClass } from '@angular/common';
import { ProductListComponent } from '../../Core/container/product-list/product-list.component';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  @Input() productListComp!: ProductListComponent;
@ViewChild('cartAlert') cartAlert!: ElementRef;


  product: any;
  colors: string[] = [];
  sizes: string[] = [];

  selectedColor: string | null = null;
  selectedSize: string | null = null;

  quantity: number = 1;

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    if (this.productListComp?.selectedProduct) {
      this.product = this.productListComp.selectedProduct;

      this.colors = this.product.colors?.split(',').map((c: string) => c.trim().toLowerCase()) || [];
      this.sizes = this.product.sizes?.split(',').map((s: string) => s.trim()) || [];

      this.loading = false;
    }
  }

  // ---------------------------
  // Select Size / Color
  // ---------------------------

  selectSize(size: string) {
    this.selectedSize = size;
  }


  selectColor(color: string) {
  this.selectedColor = color.trim().toLowerCase();
  console.log("Clicked color:", this.selectedColor);
}


  // ---------------------------
  // Quantity + / -
  // ---------------------------

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

  // ---------------------------
  // Add to Cart
  // ---------------------------

addToCart() {
  const user = this.userService.getCurrentUser();
  if (!user) { alert("Please login"); return; }

  if (!this.selectedSize || !this.selectedColor) {
    alert("Please select size & color");
    return;
  }

  const item = {
    userId: user.id,
    productId: this.product.id,
    quantity: this.quantity,
    size: this.selectedSize,
    color: this.selectedColor,
    price: +(this.product.discountPrice ?? this.product.price)
  };

    this.cartService.addToCart(item, (success) => {
    if (success) {
      this.cartService.getCart(user.id).subscribe((cart: any) => {
    const totalQty = cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    this.cartService.setCartCount(totalQty);
});

      this.showAlert();
    }
  });

}


  closeDetail() {
    this.productListComp.selectedProduct = undefined;
    document.body.style.overflow = 'auto';
  }

  // 
 showAlert() {
  const alertEl = this.cartAlert.nativeElement;

  alertEl.style.display = 'block';

  // انیمیشن fade (Bootstrap)
  setTimeout(() => {
    alertEl.classList.add('show');
  }, 10);

  // بعد 2.5 ثانیه مخفی کن
  setTimeout(() => {
    alertEl.classList.remove('show');

    setTimeout(() => {
      alertEl.style.display = 'none';
    }, 150);
    
  }, 2500);
}


}
