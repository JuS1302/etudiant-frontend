import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { StudentListComponent } from './student-list.component';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;

  const marie: Student = {
    id: 1, firstName: 'Marie', lastName: 'Curie', email: 'marie@test.fr',
    createdAt: '2026-11-19T10:00:00', updatedAt: '2026-11-19T10:00:00'
  };
  const pierre: Student = {
    id: 2, firstName: 'Pierre', lastName: 'Curie', email: 'pierre@test.fr',
    createdAt: '2026-11-19T10:00:00', updatedAt: '2026-11-19T10:00:00'
  };
  // Faux StudentService : renvoie 2 étudiants, et la suppression réussit toujours
  const studentServiceMock = {
    getAll: jest.fn(() => of([marie, pierre])),
    delete: jest.fn(() => of(undefined)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        provideRouter([]),
        { provide: StudentService, useValue: studentServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    // detectChanges() déclenche ngOnInit, qui charge la liste
    fixture.detectChanges();
  });

  it('charge les étudiants à l\'ouverture de l\'écran', () => {
    expect(studentServiceMock.getAll).toHaveBeenCalled();
    expect(component.students).toEqual([marie, pierre]);
    expect(component.isLoading).toBe(false);
  });

  it('affiche une ligne par étudiant dans le tableau', () => {
    // THEN : 2 lignes dans le corps du tableau, avec les noms des étudiants
    const page: HTMLElement = fixture.nativeElement;
    const tableRows = page.querySelectorAll('tbody tr');
    expect(tableRows.length).toBe(2);
    expect(tableRows[0].textContent).toContain('Marie');
    expect(tableRows[1].textContent).toContain('Pierre');
  });

  it('supprime un étudiant après confirmation et le retire de la liste', () => {
    // GIVEN : l'utilisateur confirme la suppression
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    // WHEN
    component.deleteStudent(marie);

    // THEN : le service supprime l'étudiant n°1, qui disparaît de la liste affichée
    expect(studentServiceMock.delete).toHaveBeenCalledWith(1);
    expect(component.students).toEqual([pierre]);
  });
});
