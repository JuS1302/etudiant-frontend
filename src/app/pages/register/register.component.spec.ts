import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  // Faux UserService : l'inscription réussit toujours
  const userServiceMock = { register: jest.fn(() => of({})) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    // L'inscription réussie affiche une alerte : on la remplace pour qu'elle ne bloque pas le test
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('envoie le nouvel agent puis redirige vers /login', () => {
    // GIVEN : le formulaire est rempli
    component.registerForm.setValue({ firstName: 'John', lastName: 'Doe', login: 'john', password: 'secret' });

    // WHEN
    component.onSubmit();

    // THEN : le service reçoit l'agent, et on est redirigé vers la connexion
    expect(userServiceMock.register).toHaveBeenCalledWith(
      { firstName: 'John', lastName: 'Doe', login: 'john', password: 'secret' }
    );
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('onReset() vide le formulaire', () => {
    // GIVEN
    component.registerForm.setValue({ firstName: 'John', lastName: 'Doe', login: 'john', password: 'secret' });
    component.submitted = true;

    // WHEN
    component.onReset();

    // THEN
    expect(component.submitted).toBe(false);
    expect(component.registerForm.get('login')?.value).toBeNull();
  });
});
