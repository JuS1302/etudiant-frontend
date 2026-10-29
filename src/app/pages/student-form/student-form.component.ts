import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '../../shared/material.module';
import { StudentService } from '../../core/service/student.service';
import { StudentRequest } from '../../core/models/StudentRequest';
import { Student } from '../../core/models/Student';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-student-form',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './student-form.component.html',
  standalone: true,
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnInit {
  private studentService = inject(StudentService);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  studentForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  studentId: number | null = null;

  /**
   * Crée le formulaire avec les trois champs obligatoires (l'email doit être valide).
   * S'il y a un id dans l'adresse (/students/:id/edit), on est en modification :
   * le formulaire est pré-rempli avec l'étudiant.
   */
  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.studentId = Number(idParam);
      this.loadStudent(this.studentId);
    }
  }

  /**
   * Indique si l'écran sert à modifier (true) ou à ajouter (false) un étudiant.
   */
  get isEditMode(): boolean {
    return this.studentId !== null;
  }

  /**
   * Raccourci pour accéder aux champs du formulaire depuis le HTML.
   */
  get form() {
    return this.studentForm.controls;
  }

  /**
   * Charge l'étudiant à modifier et remplit le formulaire avec ses valeurs.
   */
  private loadStudent(id: number): void {
    this.isLoading = true;
    this.studentService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (student) => {
          this.isLoading = false;
          this.studentForm.patchValue({
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email
          });
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message ?? 'Impossible de charger cet étudiant.';
        }
      });
  }

  /**
   * Envoie l'étudiant au back (création ou modification), puis affiche son détail.
   */
  onSubmit(): void {
    this.submitted = true;
    if (this.studentForm.invalid) {
      return;
    }
    const student: StudentRequest = {
      firstName: this.studentForm.get('firstName')?.value,
      lastName: this.studentForm.get('lastName')?.value,
      email: this.studentForm.get('email')?.value
    };

    const request: Observable<Student> = this.isEditMode
      ? this.studentService.update(this.studentId as number, student)
      : this.studentService.create(student);

    this.isLoading = true;
    this.errorMessage = null;
    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (saved) => {
          this.isLoading = false;
          this.router.navigate(['/students', saved.id]);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message ?? error.error?.detail ?? 'Impossible d\'enregistrer cet étudiant.';
        }
      });
  }
}
