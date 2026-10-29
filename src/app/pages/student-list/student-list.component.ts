import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

@Component({
  selector: 'app-student-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './student-list.component.html',
  standalone: true,
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private destroyRef = inject(DestroyRef);
  students: Student[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  /**
   * Charge la liste des étudiants à l'ouverture de l'écran.
   */
  ngOnInit(): void {
    this.loadStudents();
  }

  /**
   * Demande la liste des étudiants au back et gère les états chargement / erreur / succès.
   */
  loadStudents(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.studentService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (students) => {
          this.isLoading = false;
          this.students = students;
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message ?? 'Impossible de charger les étudiants.';
        }
      });
  }

  /**
   * Supprime un étudiant après confirmation, puis le retire de la liste affichée.
   */
  deleteStudent(student: Student): void {
    if (!confirm(`Supprimer ${student.firstName} ${student.lastName} ?`)) {
      return;
    }
    this.errorMessage = null;
    this.studentService.delete(student.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.students = this.students.filter(s => s.id !== student.id);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = error.error?.message ?? 'Impossible de supprimer cet étudiant.';
        }
      });
  }
}
