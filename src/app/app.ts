import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Api } from './core/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  verified = signal(false);
  protected readonly title = signal('test');

  constructor(private router: Router, private api: Api) {
    this.verified.set(this.api.verify());
    if (!this.verified()) {
      this.router.navigate(['/settings']);
    }
  }
}
