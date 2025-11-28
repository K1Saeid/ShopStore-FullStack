import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink , PaginationComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: any[] = [];
  loading: boolean = true;
  error: string = '';
  showDeleteModal = false;
  selectedProduct: any = null;
  page = 1;
  pageSize = 5;


  constructor(private productService: ProductService) { }


  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error loading products!';
        this.loading = false;
      }
    });
  }
  openDeleteModal(product: any) {
  this.selectedProduct = product;
  this.showDeleteModal = true;
  }
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedProduct = null;
  }
  confirmDelete() {
    if (!this.selectedProduct) return;

    this.productService.deleteProduct(this.selectedProduct.id).subscribe({
      next: () => {
        // محصول را از جدول حذف کن
        this.products = this.products.filter(p => p.id !== this.selectedProduct.id);

        this.closeDeleteModal();
      },
      error: () => {
        alert("Error deleting product!");
      }
    });
  }
  get paginatedProducts() {
  const start = (this.page - 1) * this.pageSize;
  return this.products.slice(start, start + this.pageSize);
}


}
