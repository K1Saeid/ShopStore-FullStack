import { Component } from '@angular/core';
import { UserService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [FormsModule, CommonModule, RouterLink]
})
export class SignupComponent {

  fullName = '';
  email = '';
  password = '';

  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
  this.loading = true;
  this.errorMessage = null;
  this.successMessage = null;

  const dto = {
    fullName: this.fullName,
    email: this.email,
    password: this.password
  };

  this.userService.signup(dto).subscribe({
    next: () => {
      this.loading = false;
      this.successMessage = "Registratie succesvol! U kunt nu inloggen.";

      setTimeout(() => {
        this.router.navigate(['/auth/signin']);
      }, 1200);
    },
    error: () => {
      this.loading = false;
      this.errorMessage = "Registratie mislukt. Probeer opnieuw.";
    }
  });
}

}
