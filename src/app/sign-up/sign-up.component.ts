import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  setform: FormGroup;
  formdata: any = [];
  constructor(public formBuilder: FormBuilder, private dataService: AppService , private router: Router, private spinner: NgxSpinnerService ) {
    this.setform = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      password:  new FormControl('', [Validators.required])
    });
    this.showspener()
  }
  showspener(){
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }
  onSubmit() {
    const formData = this.setform.value;

    this.dataService.adduserData(formData).subscribe(() => {
      this.getdata(() => {
        // name password stor in sessionstorage
        sessionStorage.setItem('username', formData.name);
        sessionStorage.setItem('password', formData.password);
        this.showspener()  //show spener

         // opt coped to clip bord
          if (this.formdata.length > 0) {
            const lastEntry = this.formdata[this.formdata.length - 1];
            const tempInput = document.createElement('input');
            tempInput.value = lastEntry.id;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            Swal.fire({
              title: `Your Code (OTP) is "${lastEntry.id}" <br/> Do you went copy it?`,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No',
              confirmButtonColor: '#43b02a',
              showCloseButton: false,
              focusConfirm: false,
              showCancelButton: false,
            });
          }
        this.router.navigate(['/login']);

      });
    });

    this.setform.reset();
  }

  getdata(callback: () => void) {
    this.dataService.getUserapi().subscribe((data: any) => {
      this.formdata = data;
      // Invoke the callback function after data is retrieved
      callback();
    });
  }

}
