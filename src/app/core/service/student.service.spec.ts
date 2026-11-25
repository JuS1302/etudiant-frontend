import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { StudentService } from './student.service';
import { Student } from '../models/Student';
import { StudentRequest } from '../models/StudentRequest';

describe('StudentService', () => {
  let service: StudentService;
  // Faux serveur HTTP : il intercepte les requêtes au lieu de les envoyer au vrai back
  let httpMock: HttpTestingController;

  const marie: Student = {
    id: 1, firstName: 'Marie', lastName: 'Curie', email: 'marie@test.fr',
    createdAt: '2026-11-19T10:00:00', updatedAt: '2026-11-19T10:00:00'
  };
  const marieRequest: StudentRequest = { firstName: 'Marie', lastName: 'Curie', email: 'marie@test.fr' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Vérifie qu'aucune requête inattendue n'est restée sans réponse
    httpMock.verify();
  });

  it('getAll() fait un GET sur /api/students et renvoie la liste', () => {
    let receivedStudents: Student[] = [];

    // WHEN
    service.getAll().subscribe(students => receivedStudents = students);

    // THEN
    const request = httpMock.expectOne('/api/students');
    expect(request.request.method).toBe('GET');
    request.flush([marie]);
    expect(receivedStudents).toEqual([marie]);
  });

  it('getById() fait un GET sur /api/students/1 et renvoie l\'étudiant', () => {
    let receivedStudent: Student | undefined;

    // WHEN
    service.getById(1).subscribe(student => receivedStudent = student);

    // THEN
    const request = httpMock.expectOne('/api/students/1');
    expect(request.request.method).toBe('GET');
    request.flush(marie);
    expect(receivedStudent).toEqual(marie);
  });

  it('create() fait un POST sur /api/students avec le StudentRequest', () => {
    let studentCreated: Student | undefined;

    // WHEN
    service.create(marieRequest).subscribe(student => studentCreated = student);

    // THEN : le body envoyé est le StudentRequest, et on reçoit l'étudiant créé
    const request = httpMock.expectOne('/api/students');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(marieRequest);
    request.flush(marie);
    expect(studentCreated).toEqual(marie);
  });

  it('update() fait un PUT sur /api/students/1 avec le StudentRequest', () => {
    let updatedStudent: Student | undefined;

    // WHEN
    service.update(1, marieRequest).subscribe(student => updatedStudent = student);

    // THEN
    const request = httpMock.expectOne('/api/students/1');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(marieRequest);
    request.flush(marie);
    expect(updatedStudent).toEqual(marie);
  });

  it('delete() fait un DELETE sur /api/students/1', () => {
    // WHEN
    service.delete(1).subscribe();

    // THEN
    const request = httpMock.expectOne('/api/students/1');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
