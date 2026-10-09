import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { Login } from '../../core/models/Login';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  loginForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  token: string | null = null;

  /**
   * Crée le formulaire avec les deux champs obligatoires.
   */
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * Raccourci pour accéder aux champs du formulaire depuis le HTML.
   */
  get form() {
    return this.loginForm.controls;
  }

  /**
   * Envoie les identifiants au back-end et gère les états chargement / erreur / succès.
   */
  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const credentials: Login = {
      login: this.loginForm.get('login')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.isLoading = true;
    this.errorMessage = null;
    this.token = null;

    this.userService.login(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.token = response.token;
          localStorage.setItem('token', response.token);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(error);
        }
      });
  }

  /**
   * Transforme l'erreur HTTP reçue en message lisible pour l'utilisateur.
   */
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 401) {
      return 'Login ou mot de passe incorrect.';
    }
    if (error.status === 0) {
      return 'Impossible de contacter le serveur. Le back-end est-il lancé ?';
    }
    return error.error?.message ?? error.error?.detail ?? 'Une erreur est survenue.';
  }
}
