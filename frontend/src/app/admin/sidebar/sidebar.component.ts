import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink , RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';





@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

}
