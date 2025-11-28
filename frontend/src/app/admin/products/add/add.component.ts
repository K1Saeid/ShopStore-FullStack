import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule , EditorModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddProductComponent {
  successMessage = '';
  errorMessage = '';
  selectedFile: File | null = null;
  previewImage: any = null;
  categories: any[] = [];

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

  loading = false;
  constructor(private productService: ProductService, private router: Router ,   private categoryService: CategoryService) { }
 
  ngOnInit() {
  this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(res => {
      this.categories = res;
    });
  }

      submit() {
  this.loading = true;
  this.errorMessage = '';
  this.successMessage = '';

  // slug
  this.product.slug = this.product.name.toLowerCase().replace(/ /g, '-');

  // ❗ دسته انتخاب نشده؟
  if (!this.product.categoryId) {
    this.errorMessage = "Please select a category!";
    this.loading = false;
    return;
  }

  // ❗ فایل انتخاب شده
  if (this.selectedFile) {
    this.productService.uploadImage(this.selectedFile).subscribe({
      next: (res) => {
        this.product.imageUrl = res.imageUrl;
        this.saveProduct();
      },
      error: () => {
        this.errorMessage = "Error uploading image!";
        this.loading = false;
      }
    });
  } else {
    // بدون آپلود مستقیم ذخیره کن
    this.saveProduct();
  }
}

saveProduct() {
  this.product.categoryId = Number(this.product.categoryId);

  this.productService.createProduct(this.product).subscribe({
    next: () => {
      this.successMessage = "Product added!";
      setTimeout(() => this.router.navigate(['/admin/products']), 1500);
    },
    error: () => {
      this.errorMessage = "Error adding product!";
      this.loading = false;
    }
  });
}



   
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }
      

}
