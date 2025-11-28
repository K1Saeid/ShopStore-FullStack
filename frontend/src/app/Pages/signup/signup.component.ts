import { Component } from '@angular/core';
import { UserService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports: [FormsModule, CommonModule, RouterLink]

})
export class SignupComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    const user = {
      fullName: this.fullName,
      email: this.email,
      password: this.password 
    };

    this.userService.signup(user).subscribe({
      next: (res) => {
        alert('Registratie succesvol! U kunt nu inloggen.');
        this.router.navigate(['/signin']);
      },
      error: (err) => {
        alert('fout bij registratie. Probeer het opnieuw.');
      }
    });
  }
}
