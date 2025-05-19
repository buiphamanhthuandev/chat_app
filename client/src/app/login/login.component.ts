import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../models/api-response';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatInput, MatFormFieldModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email!:string;
  password!:string;
  hidePassword:boolean = true;

  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  login() {
    this.authService.login(this.email, this.password)
    .subscribe({
      next:()=>{
        this.authService.me().subscribe();
        this.snackBar.open("Logged in successfully.","Close");
      },
      error:(err:HttpErrorResponse)=>{
        let error = err.error as ApiResponse<string>;

        this.snackBar.open(error.error, "Close",{
          duration: 3000
        });
      },
      complete:()=>{
        this.router.navigate(["/"]);
      }
    })
  }

  togglePassword(event: MouseEvent){
    this.hidePassword = !this.hidePassword;
    event.stopPropagation();
  }

}
