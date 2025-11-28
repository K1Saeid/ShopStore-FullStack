import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/auth.service';
import { Router,RouterLink } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  email = '';
  password = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}
  

  onSubmit() {
    const user = {
      email: this.email,
      password: this.password 
    };

    this.userService.signin(user).subscribe({
      next: (res) => {
        localStorage.setItem('user', JSON.stringify(res));
        this.router.navigateByUrl('/', { replaceUrl: true });
      },
      error: () => {
        alert('Email of wachtwoord klopt niet!');
      }
    });
  }
}
