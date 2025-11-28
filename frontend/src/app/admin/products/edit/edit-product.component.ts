import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';


@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  selectedFile: File | null = null;
  previewImage: any = null;
  categories: any[] = [];
  id!: number;

 product = {
    name: '',
    description: '',
    brand: '',
    gender: 'UNISEX',
    sizes: '',
    colors: '',
    price: 0,
    discountPrice: 0,
    itemsLeft: 0,
    inStock: true,
    imageUrl: '',
    slug: '',
    categoryId: null,
    categoryName: ''
  };

  loading = true;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCategories();
    this.loadProduct();
  }

  loadProduct() {
    this.productService.getProductById(this.id).subscribe({
      next: (res) => {
        this.product = res;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Product not found!';
        this.loading = false;
      }
    });
  }

  updateProduct() {
    this.successMessage = '';
    this.errorMessage = '';

    this.product.slug = this.product.name.toLowerCase().replace(/ /g, '-');

    // اگر فایل جدید انتخاب شده بود → اول باید upload کنیم
  if (this.selectedFile) {

    this.productService.uploadImage(this.selectedFile).subscribe({
      next: (res) => {
        this.product.imageUrl = res.imageUrl; // دریافت لینک جدید عکس

        this.saveUpdate(); // ادامه update
      },
      error: () => {
        this.errorMessage = "Error uploading image!";
      }
    });

  } else {
    // هیچ عکس جدیدی انتخاب نشده
    this.saveUpdate();
  }
    this.productService.updateProduct(this.id, this.product).subscribe({
      next: () => {
        this.successMessage = 'Product updated successfully!';

        setTimeout(() => {
          this.router.navigate(['/admin/products']);
        }, 1500);
      },
      error: () => {
        this.errorMessage = 'Error updating product!';
      }
    });
  }

  // Handle file selection
    onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result;
    };

    reader.readAsDataURL(this.selectedFile);
  }

  // Save the updated product details
    saveUpdate() {
    this.productService.updateProduct(this.id, this.product).subscribe({
      next: () => {
        this.successMessage = "Product updated successfully!";
        setTimeout(() => this.router.navigate(['/admin/products']), 1500);
      },
      error: () => {
        this.errorMessage = "Error updating product!";
      }
    });
    }
  // Load categories for the dropdown
      loadCategories() {
      this.categoryService.getAll().subscribe(res => {
        this.categories = res;
      });
    }

}
