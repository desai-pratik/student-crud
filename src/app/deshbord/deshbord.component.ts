import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-deshbord',
  templateUrl: './deshbord.component.html',
  styleUrls: ['./deshbord.component.css']
})
export class DeshbordComponent{
  constructor(public formBuilder: FormBuilder, private dataService: AppService , private router: Router , private spinner: NgxSpinnerService) {
     this.showspener()
    }

  formdata: any = [];

  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  getdata() {
    this.dataService.getUserapi().subscribe((data: any) => {
      this.formdata = data;
    });
  } 
public username = sessionStorage.getItem('username');

showspener(){
  this.spinner.show();
  setTimeout(() => {
    this.spinner.hide();
  }, 800);
}
}
