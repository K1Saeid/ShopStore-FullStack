import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchText: string = '';

  @Output()
  searchTextChanged: EventEmitter<string> = new EventEmitter<string>();

  // هر بار که متن input تغییر می‌کند
  onInputChange() {
    // مقدار سرچ را به کامپوننت والد (product-list) می‌فرستد
    this.searchTextChanged.emit(this.searchText.trim().toLowerCase());
  }
}
