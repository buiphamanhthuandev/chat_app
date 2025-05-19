import { Component, inject, signal } from '@angular/core';
import {MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../models/api-response';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, FormsModule, MatButtonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email!:string;
  password!:string;
  userName!:string;
  fullName!:string;
  profilePicture :string ='https://randomuser.me/api/portraits/lego/5.jpg';
  profileImage: File | null = null;
  hidePassword: boolean = false;


  //inject dependency
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router)
  //function register account
  register(){
    let formData = new FormData();
    formData.append("email",this.email);
    formData.append("password",this.password);
    formData.append("userName",this.userName);
    formData.append("fullName",this.fullName);
    formData.append("profileImage",this.profileImage!);
    this.authService.register(formData).subscribe({
      next: () => {
        this.snackBar.open("User register successfully", "Close");
      },
      error:(error:HttpErrorResponse) => {
        let err = error.error as ApiResponse<string>;
        this.snackBar.open(err.error,"Close");
      },
      complete:() =>{
        this.router.navigate(['/']);
      }

    })
  }


  //toggle visibility vs hiden password
  togglePassword(event: MouseEvent){

    this.hidePassword = !this.hidePassword;
  }

  //select file image
  onFileSelected(event:any){
    const file: File = event.target.files[0];
    if(file){
      this.profileImage = file;

      const render = new FileReader();
      render.onload = (e) =>{
        this.profilePicture = e.target!.result as string;
        console.log("onload",e.target!.result);
      }
      render.readAsDataURL(file);
      console.log("read", this.profilePicture)
    }

  }
}
