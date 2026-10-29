import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/Student';
import { StudentRequest } from '../models/StudentRequest';

const STUDENTS_URL = '/api/students';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private httpClient: HttpClient) { }

  /**
   * Récupère la liste de tous les étudiants.
   */
  getAll(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(STUDENTS_URL);
  }

  /**
   * Récupère le détail d'un étudiant à partir de son id.
   */
  getById(id: number): Observable<Student> {
    return this.httpClient.get<Student>(`${STUDENTS_URL}/${id}`);
  }

  /**
   * Crée un nouvel étudiant et renvoie l'étudiant créé (avec son id).
   */
  create(student: StudentRequest): Observable<Student> {
    return this.httpClient.post<Student>(STUDENTS_URL, student);
  }

  /**
   * Modifie un étudiant existant et renvoie l'étudiant modifié.
   */
  update(id: number, student: StudentRequest): Observable<Student> {
    return this.httpClient.put<Student>(`${STUDENTS_URL}/${id}`, student);
  }

  /**
   * Supprime un étudiant (le back répond 204, sans contenu).
   */
  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${STUDENTS_URL}/${id}`);
  }
}
