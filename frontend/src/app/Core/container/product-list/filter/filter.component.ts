import { Component, Input, Output, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter',
  imports: [FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Input()
  all: number = 0;
  
  @Input()
  inStock: number = 0;

  @Input()
  outOfStock: number = 0;

  @Output()
  selectedFilterRadioChange: EventEmitter<string> = new EventEmitter<string>();

  selectedFilterRadio: string = 'All';

   onFilterRadioSelected(filterRadio: string) {
   
    this.selectedFilterRadioChange.emit(this.selectedFilterRadio);
  }
  // onFilterRadioSelected(filterRadio: string) {
  //   this.selectedFilterRadio = filterRadio;
  // }
  // constructor() {
  //   // Dummy values for demonstration
  //   this.all = 100;
  //   this.inStock = 75;
  //   this.outOfStock = 25;
  // }
}
