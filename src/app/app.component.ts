import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from './core/service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  title = 'etudiant-frontend';

  /**
   * Indique si l'utilisateur est connecté, pour afficher les bons liens dans la barre de navigation.
   */
  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  /**
   * Déconnecte l'utilisateur (supprime son token) et le renvoie vers la page de login.
   */
  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
