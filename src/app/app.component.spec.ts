import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AppComponent } from './app.component';
import { UserService } from './core/service/user.service';

describe('AppComponent', () => {
  // Faux UserService : on décide nous-mêmes si l'utilisateur est connecté
  const userServiceMock = { isLoggedIn: jest.fn(), logout: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: userServiceMock },
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const appComponent = fixture.componentInstance;
    expect(appComponent).toBeTruthy();
  });

  it(`should have the 'etudiant-frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const appComponent = fixture.componentInstance;
    expect(appComponent.title).toEqual('etudiant-frontend');
  });

  it('affiche "Étudiants" et "Déconnexion" quand l\'utilisateur est connecté', () => {
    // GIVEN
    userServiceMock.isLoggedIn.mockReturnValue(true);

    // WHEN
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    // THEN
    const navbar: HTMLElement = fixture.nativeElement.querySelector('nav');
    expect(navbar.textContent).toContain('Étudiants');
    expect(navbar.textContent).toContain('Déconnexion');
  });

  it('affiche "Connexion" et "Inscription" quand l\'utilisateur n\'est pas connecté', () => {
    // GIVEN
    userServiceMock.isLoggedIn.mockReturnValue(false);

    // WHEN
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    // THEN
    const navbar: HTMLElement = fixture.nativeElement.querySelector('nav');
    expect(navbar.textContent).toContain('Connexion');
    expect(navbar.textContent).toContain('Inscription');
  });

  it('logout() déconnecte l\'utilisateur et renvoie vers /login', () => {
    // GIVEN
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    // WHEN
    fixture.componentInstance.logout();

    // THEN
    expect(userServiceMock.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
