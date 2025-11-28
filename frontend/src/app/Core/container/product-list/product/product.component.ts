import { NgStyle,NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  imports: [NgStyle,NgIf]
})
export class ProductComponent {
  @Input() product!: any;

  constructor(private router: Router) { }

}
