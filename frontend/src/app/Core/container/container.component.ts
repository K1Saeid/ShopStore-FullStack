import { Component, input, ViewChild } from '@angular/core';
import { SearchComponent } from "./search/search.component";
import { NgForOf, NgIf } from "@angular/common";
import { ProductListComponent } from "../../Core/container/product-list/product-list.component";
import { ProductDetailComponent } from "../../features/product-detail/product-detail.component";
import { SliderComponent } from "../../features/slider/slider.component";

@Component({
  selector: 'app-container',
  imports: [ProductListComponent, ProductDetailComponent, NgIf, SliderComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css'
})
export class ContainerComponent {
 
  searchText: string = '';  

  @ViewChild(ProductListComponent) productListComponent: ProductListComponent;
  setSearchText( value: string) {
    this.searchText = value;
  }

  
} 
