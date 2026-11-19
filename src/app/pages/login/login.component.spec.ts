import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { UserService } from '../../core/service/user.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  // Faux UserService : le login réussit toujours et renvoie un faux token
  const userServiceMock = {
    login: jest.fn(() => of({ token: 'fake-token' })),
    saveToken: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('affiche les champs login et mot de passe', () => {
    // THEN : l'écran contient bien les 2 champs du formulaire
    const page: HTMLElement = fixture.nativeElement;
    expect(page.querySelector('input[formControlName="login"]')).toBeTruthy();
    expect(page.querySelector('input[formControlName="password"]')).toBeTruthy();
  });

  it('envoie les identifiants, range le token et redirige vers /students', () => {
    // GIVEN : le formulaire est rempli
    component.loginForm.setValue({ login: 'john', password: 'secret' });

    // WHEN
    component.onSubmit();

    // THEN : le service reçoit les identifiants, le token est rangé, et on change d'écran
    expect(userServiceMock.login).toHaveBeenCalledWith({ login: 'john', password: 'secret' });
    expect(userServiceMock.saveToken).toHaveBeenCalledWith('fake-token');
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });
});
