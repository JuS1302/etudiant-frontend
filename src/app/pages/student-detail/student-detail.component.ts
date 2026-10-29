import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

@Component({
  selector: 'app-student-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './student-detail.component.html',
  standalone: true,
  styleUrl: './student-detail.component.css'
})
export class StudentDetailComponent implements OnInit {
  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  student: Student | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  /**
   * Lit l'id dans l'adresse (/students/:id) et charge l'étudiant correspondant.
   */
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.studentService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (student) => {
          this.isLoading = false;
          this.student = student;
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message ?? 'Impossible de charger cet étudiant.';
        }
      });
  }

  /**
   * Supprime l'étudiant après confirmation, puis revient à la liste.
   */
  deleteStudent(): void {
    if (!this.student || !confirm(`Supprimer ${this.student.firstName} ${this.student.lastName} ?`)) {
      return;
    }
    this.studentService.delete(this.student.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/students']),
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message ?? 'Impossible de supprimer cet étudiant.';
        }
      });
  }
}
