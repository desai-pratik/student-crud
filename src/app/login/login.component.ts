import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import Swal from 'sweetalert2';
import { AuthGuardService } from '../auth-guard.service';
import { AuthGuard } from '../auth.guard';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{
  constructor(
    private dataService: AppService,
    private router: Router,
    private auth: AuthGuard,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      id: ['', Validators.required],
    });
  }
 
  formdata: any = [];
  selectedDataId: number = -1;
  public forgetpassword: boolean = false;
  loginForm: FormGroup ;

  ngOnInit(): void {
    this.getdata();
    this.showspener();
  }

  showspener(){
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

  getdata() {
    this.dataService.getUserapi().subscribe((data: any) => {
      this.formdata = data;
    });
  }
  login() {
    let loginSuccessful = false;

    this.formdata.forEach((e: any) => {
      if (
        this.loginForm.value.name === e.name &&
        this.loginForm.value.password === e.password &&
        this.loginForm.value.id === e.id
      ) {
        this.auth.login();
        loginSuccessful = true;
        this.router.navigate(['/crud']);
      }
    }); 
       if (!loginSuccessful) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid Username or Password or OTP!',
      });
    }
  }
 

// fogret password id
forgetpass() {
  const selectedData = this.formdata.find(
    (item: { name: string; id: number }) => item.name === this.loginForm.value.name
    
    );
    
    if (selectedData) {
    this.forgetpassword = true;
    this.loginForm.patchValue({
      name: selectedData.name,
      id: selectedData.id,
    });
  }else{ 
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `The name " ${this.loginForm.value.name} " is not found in the database. Please enter a correct name.`,
    });
    return; 
  } 
}

 resetPassword() {
    if (this.forgetpassword) {
      const formData = this.loginForm.value;
      const index = this.formdata.findIndex(
        (item: { name: string; id: number }) => item.name === this.loginForm.value.name
      );
      if (index !== -1) {
        this.formdata[index].password = formData.password;
        this.dataService.updateUserData(this.formdata[index].id, this.formdata[index]).subscribe(() => {});
      }
      this.forgetpassword = false;
      this.loginForm.reset();
    }
  } 
}