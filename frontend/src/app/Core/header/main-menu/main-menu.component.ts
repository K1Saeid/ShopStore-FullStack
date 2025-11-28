import { Component } from '@angular/core';
import { NgForOf } from "@angular/common";

@Component({
  selector: 'main-menu',
  imports: [NgForOf],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {
  mainMenuItems: string[] = ['Home', 'Products'];
}
