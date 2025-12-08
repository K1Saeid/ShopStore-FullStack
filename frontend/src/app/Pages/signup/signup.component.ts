import { Component } from '@angular/core';
import { UserService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports: [FormsModule, CommonModule, RouterLink]
})
export class SignupComponent {

  fullName = '';
  email = '';
  password = '';

  loading = false;         // <-- اضافه شد
  errorMessage = '';       // <-- اضافه شد
  successMessage = '';     // <-- اگر بخوای پیام موفقیت نشون بدی

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const user = {
      fullName: this.fullName,
      email: this.email,
      password: this.password 
    };

    this.userService.signup(user).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = "Account succesvol aangemaakt! U kunt nu inloggen.";
        setTimeout(() => {
          this.router.navigate(['/signin']);
        }, 1000);
      },

      error: (err) => {
        this.loading = false;

        if (err.status === 409) {
          this.errorMessage = "Er bestaat al een account met dit emailadres.";
        } else {
          this.errorMessage = "Registratie mislukt. Probeer opnieuw.";
        }
      }
    });
  }
}
