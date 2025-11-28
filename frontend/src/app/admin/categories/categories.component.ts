import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';



@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categories: any[] = [];
  loading = true;
  //
  successMessage: string = '';
  showDeleteModal = false;
  deleteId: number = 0;
  deleteName: string = '';
  //
  showModal = false;
  editMode = false;

  selected: any = { id: 0, name: '', description: '' };

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.categoryService.getAll().subscribe(res => {
      this.categories = res;
      this.loading = false;
    });
  }

  openAdd() {
    this.editMode = false;
    this.selected = { id: 0, name: '', description: '' };
    this.showModal = true;
  }

  openEdit(cat: any) {
    this.editMode = true;
    this.selected = { ...cat };
    this.showModal = true;
  }

  save() {
    if (this.editMode) {
      this.categoryService.update(this.selected.id, this.selected).subscribe(() => {
        this.showModal = false;
       
        this.successMessage = "Category edited successfully!";

    // Auto hide alert after 3 seconds
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);

    this.load();
      });
    } else {
      this.categoryService.create(this.selected).subscribe(() => {
        this.showModal = false;
        this.successMessage = "Category created  successfully!";

    // Auto hide alert after 3 seconds
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);

    this.load();
      });
    }
  }
  openDeleteModal(cat: any) {
  this.deleteId = cat.id;
  this.deleteName = cat.name;
  this.showDeleteModal = true;
}

confirmDelete() {
  this.categoryService.delete(this.deleteId).subscribe(() => {
    this.showDeleteModal = false;
    this.successMessage = "Category deleted successfully!";

    // Auto hide alert after 3 seconds
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);

    this.load();
  });
}

  
}
