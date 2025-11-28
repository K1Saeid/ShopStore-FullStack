import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "../../../Core/footer/footer.component";
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet , FooterComponent],
  templateUrl: `./auth-layout.component.html`,
  styleUrl: `./auth-layout.component.css`
})
export class AuthLayoutComponent {}
