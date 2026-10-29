import { Routes } from '@angular/router';
import {RegisterComponent} from './pages/register/register.component';
import {LoginComponent} from './pages/login/login.component';
import {StudentListComponent} from './pages/student-list/student-list.component';
import {StudentDetailComponent} from './pages/student-detail/student-detail.component';
import {StudentFormComponent} from './pages/student-form/student-form.component';
import {authGuard} from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'students',
    pathMatch: 'full'
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  // Écrans étudiants : accessibles uniquement si l'utilisateur est connecté (authGuard).
  // 'students/new' doit être déclarée avant 'students/:id', sinon "new" serait lu comme un id.
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/new',
    component: StudentFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/:id',
    component: StudentDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/:id/edit',
    component: StudentFormComponent,
    canActivate: [authGuard]
  }

];
