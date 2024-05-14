import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { AppService } from '../app.service';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
function emailValidator(control: AbstractControl): { [key: string]: any } | null {
  const email: string = control.value;
  if (email && !email.toLowerCase().endsWith('.com')) {
    return { 'invalidEmail': true };
  }
  return null;
}
@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent {
  formdata: any = [];
  jsonData: any;
  myForm: FormGroup;
  isEditing = false;
  selectedDataId: number = -1;
  editingId: number | null = null;
  editingData: any;

  // loading: boolean = false;

  letterpatturn = /^[a-zA-Z]{2,}$/ ;
  emailvalidatin =  /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
  mobilnumber = /^[0-9]{10}$/ ;

  constructor(public formBuilder: FormBuilder, private dataService: AppService , private router: Router , private spinner: NgxSpinnerService) {
    this.myForm = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required , Validators.pattern(this.letterpatturn)]),
      lastName: new FormControl('', [Validators.required , Validators.pattern(this.letterpatturn)]),
      mobile: new FormControl('', [Validators.required , Validators.pattern(this.mobilnumber)]),
      email:  new FormControl('', [Validators.required , Validators.pattern(this.emailvalidatin) , emailValidator]),
      gender: [null, Validators.required],
      Add: [null, Validators.required],
      age : new FormControl('', [Validators.required , Validators.max(99)]),
      agreeToTerms: new FormControl(false, [Validators.required, Validators.requiredTrue])
      // name : ,
    });
  }
  private unsavedChanges: boolean = false;
  ngOnInit(): void {
    this.getdata();
    this.showspener();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        if (this.unsavedChanges && !window.confirm('You have unsaved changes. Do you really want to leave?')) {
          this.router.navigate([event.urlAfterRedirects]);
        }
      });
  }

  showspener(){
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 800);
  }

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  onSubmit() {
    console.log(this.myForm.value)
    this.showspener();
    const capitalizedFirstName = this.capitalizeFirstLetter(this.myForm.value.firstName);
    const capitalizedLastName = this.capitalizeFirstLetter(this.myForm.value.lastName);
    this.myForm.patchValue({
      firstName: capitalizedFirstName,
      lastName: capitalizedLastName,
    });

    const formData = this.myForm.value;
    this.dataService.addData(formData).subscribe(()=>{
      this.getdata();
       this.router.navigate([`/deshbord`])
    });
    this.myForm.reset()
  }

  getdata() {
    this.dataService.getapi().subscribe((data: any) => {
      this.formdata = data;
    });
  }
  updateData() {
    this.showspener();
    const formData = this.myForm.value;
    if (this.selectedDataId === -1) {
      this.dataService.addData(formData).subscribe(() => {
        this.getdata();
      });
    } else {
      this.dataService.updateData(this.selectedDataId, formData).subscribe(() => {
        const index = this.formdata.findIndex((item: { id: number }) => item.id === this.selectedDataId);
        if (index !== -1) {
          this.formdata[index] = { id: this.selectedDataId, ...formData };
        }
        this.isEditing = false;
        this.selectedDataId = -1;
      });
    }
    this.myForm.reset();
  }
  editData(id: number) {
    const selectedData = this.formdata.find((item: { id: number }) => item.id === id);
    this.isEditing = true;
    this.selectedDataId = id;

    if (selectedData) {
      const { id, ...dataWithoutId } = selectedData;
      this.myForm.setValue(dataWithoutId);
    }
  }


  delete(id:number){
    Swal.fire({
      title: 'Are you sure you want to delete?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#43b02a',
      showCloseButton: true,
      focusConfirm: false,
      showCancelButton: true,
    }).then((result) => {
      if (result.value) {
        this.showspener();
        this.dataService.deletdata(id).subscribe(()=>{
          this.getdata()
        })
      }
    })
  }

    controll(www: string) {
      return this.myForm.get(www) &&
        this.myForm.get(www)?.invalid &&
        this.myForm.get(www)?.touched;
    }
    private destroy$: Subject<boolean> = new Subject<boolean>();
    ngOnDestroy() {
      this.destroy$.next(true);
      this.destroy$.unsubscribe();
    }
    onRouteChange() {
      Swal.fire({
        title: `'You have unsaved changes. Do you really want to leave?'`,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        confirmButtonColor: '#43b02a',
        showCloseButton: true,
        focusConfirm: false,
        showCancelButton: true,
      }).then((result) => {
        if (result.value) {
          this.router.navigate(['/deshbord']);
        }
      })
    }

    // canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    //   if (this.myForm.dirty) {
    //     return window.confirm('You have unsaved changes. Do you really want to leave?');
    //   } else {
    //     return true;
    //   }
    // }
    logout(){
      sessionStorage.clear();
      this.router.navigate(['/login']);
    }
  }
