import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink ],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  email = '';
  password = '';
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  onSubmit() {

    this.errorMessage = null;
    this.loading = true;

    const dto = {
      email: this.email,
      password: this.password
    };

    this.userService.signin(dto).subscribe({
      next: (res: any) => {
        this.loading = false;

        localStorage.setItem('user', JSON.stringify(res));

        // اگر ادمینه → ببر به داشبورد
        if (res.role === "Admin") {
          this.router.navigate(['/admin']);
        } 
        else {
          this.router.navigate(['/'], { replaceUrl: true });
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Email of wachtwoord is onjuist.';
      }
    });
  }
}
