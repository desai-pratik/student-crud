import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { CrudComponent } from './crud/crud.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuardService } from './auth-guard.service';
import { AuthGuard } from './auth.guard';
import { DeshbordComponent } from './deshbord/deshbord.component';
import { UnsavedChangesGuard } from './deactivete-guard';
// import { AuthGuard } from './auth.guard';

const routes: Routes = [

  {path:'login', component:LoginComponent},
  {path:'deshbord', component:DeshbordComponent , canDeactivate:[UnsavedChangesGuard]},
  {path:'crud',component:CrudComponent,canActivate:[AuthGuard]  },
  {path:'',component:SignUpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
