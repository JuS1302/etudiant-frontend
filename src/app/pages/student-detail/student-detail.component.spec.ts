import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { StudentDetailComponent } from './student-detail.component';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

describe('StudentDetailComponent', () => {
  let harness: RouterTestingHarness;
  let component: StudentDetailComponent;

  const marie: Student = {
    id: 1, firstName: 'Marie', lastName: 'Curie', email: 'marie@test.fr',
    createdAt: '2026-11-19T10:00:00', updatedAt: '2026-11-19T10:00:00'
  };
  // Faux StudentService : renvoie Marie, et la suppression réussit toujours
  const studentServiceMock = {
    getById: jest.fn(() => of(marie)),
    delete: jest.fn(() => of(undefined)),
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'students/:id', component: StudentDetailComponent }]),
        { provide: StudentService, useValue: studentServiceMock },
      ]
    });
    // Le "harness" ouvre vraiment l'adresse /students/1, comme le navigateur
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/students/1', StudentDetailComponent);
  });

  it('lit l\'id dans l\'adresse et charge l\'étudiant', () => {
    expect(studentServiceMock.getById).toHaveBeenCalledWith(1);
    expect(component.student).toEqual(marie);
  });

  it('affiche les informations de l\'étudiant', () => {
    const page: HTMLElement = harness.routeNativeElement!;
    expect(page.textContent).toContain('Marie');
    expect(page.textContent).toContain('marie@test.fr');
  });

  it('supprime l\'étudiant après confirmation puis revient à la liste', () => {
    // GIVEN : l'utilisateur confirme la suppression
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    // WHEN
    component.deleteStudent();

    // THEN
    expect(studentServiceMock.delete).toHaveBeenCalledWith(1);
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });
});
