import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { StudentFormComponent } from './student-form.component';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

describe('StudentFormComponent', () => {
  let harness: RouterTestingHarness;
  let router: Router;

  const marie: Student = {
    id: 1, firstName: 'Marie', lastName: 'Curie', email: 'marie@test.fr',
    createdAt: '2026-11-19T10:00:00', updatedAt: '2026-11-19T10:00:00'
  };
  // Faux StudentService : toutes les opérations réussissent et renvoient Marie
  const studentServiceMock = {
    getById: jest.fn(() => of(marie)),
    create: jest.fn(() => of(marie)),
    update: jest.fn(() => of(marie)),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'students/new', component: StudentFormComponent },
          { path: 'students/:id/edit', component: StudentFormComponent },
        ]),
        { provide: StudentService, useValue: studentServiceMock },
      ]
    });
    harness = await RouterTestingHarness.create();
    router = TestBed.inject(Router);
  });

  describe('mode ajouter (/students/new)', () => {
    let component: StudentFormComponent;

    beforeEach(async () => {
      component = await harness.navigateByUrl('/students/new', StudentFormComponent);
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
    });

    it('affiche un formulaire vide, en mode ajouter', () => {
      expect(component.isEditMode).toBe(false);
      expect(component.studentForm.value).toEqual({ firstName: '', lastName: '', email: '' });
      expect(studentServiceMock.getById).not.toHaveBeenCalled();
    });

    it('crée l\'étudiant puis affiche son détail', () => {
      // GIVEN : le formulaire est rempli
      component.studentForm.setValue({ firstName: 'Marie', lastName: 'Curie', email: 'marie@test.fr' });

      // WHEN
      component.onSubmit();

      // THEN : le service crée l'étudiant, puis on va sur son détail
      expect(studentServiceMock.create).toHaveBeenCalledWith(
        { firstName: 'Marie', lastName: 'Curie', email: 'marie@test.fr' }
      );
      expect(router.navigate).toHaveBeenCalledWith(['/students', 1]);
    });
  });

  describe('mode modifier (/students/1/edit)', () => {
    let component: StudentFormComponent;

    beforeEach(async () => {
      component = await harness.navigateByUrl('/students/1/edit', StudentFormComponent);
      jest.spyOn(router, 'navigate').mockResolvedValue(true);
    });

    it('charge l\'étudiant et pré-remplit le formulaire', () => {
      expect(component.isEditMode).toBe(true);
      expect(studentServiceMock.getById).toHaveBeenCalledWith(1);
      expect(component.studentForm.value).toEqual({ firstName: 'Marie', lastName: 'Curie', email: 'marie@test.fr' });
    });

    it('modifie l\'étudiant puis affiche son détail', () => {
      // GIVEN : on change le nom
      component.studentForm.patchValue({ lastName: 'Sklodowska-Curie' });

      // WHEN
      component.onSubmit();

      // THEN : le service reçoit l'id et les nouvelles valeurs
      expect(studentServiceMock.update).toHaveBeenCalledWith(
        1, { firstName: 'Marie', lastName: 'Sklodowska-Curie', email: 'marie@test.fr' }
      );
      expect(router.navigate).toHaveBeenCalledWith(['/students', 1]);
    });
  });
});
