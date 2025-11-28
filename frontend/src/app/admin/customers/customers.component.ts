import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/pagination/pagination.component'
import { RouterLink  } from '@angular/router';


@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [RouterLink, CommonModule , FormsModule, PaginationComponent  ],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {

  customers: any[] = [];
  loading = true;
  searchText = '';
  page = 1;
  pageSize = 5;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.customers = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error("Cannot load customers!");
      }
    });
  }
 

  get filteredCustomers() {
    if (!this.searchText.trim()) return this.customers;

    const text = this.searchText.toLowerCase();

    return this.customers.filter(c =>
      c.fullName.toLowerCase().includes(text) ||
      c.email.toLowerCase().includes(text)
    );
  }
  get paginatedCustomers() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredCustomers.slice(start, start + this.pageSize);
  }


}
