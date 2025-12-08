import { Component } from '@angular/core';
import { NgForOf } from "@angular/common";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'main-menu',
  imports: [NgForOf , RouterLink],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {
  mainMenuItems: string[] = ['Home', 'Products'];
}
