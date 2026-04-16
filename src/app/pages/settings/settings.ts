import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Api } from '../../core/api';
import { AppButton } from '../../shared/components/app-button/app-button';
import { Router } from "@angular/router";
import { AppInput } from '../../shared/components/input/input';
import { form, required, submit } from '@angular/forms/signals';
import { LoginData } from '../../shared/model/loginData';
import { Alert } from '../../shared/components/alert/alert';

@Component({
  selector: 'app-settings',
  imports: [AppButton, AppInput, Alert],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  showAlert = signal(false);

  constructor(private router: Router, private api: Api) { }

  loginModel = signal<LoginData>({ id: '', secret: '' });

  loginForm = form(this.loginModel, (fieldPath) => {
    required(fieldPath.id, { message: 'ID is required' });
    required(fieldPath.secret, { message: 'Secret is required' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.loginForm, async () => {
      const { id, secret } = this.loginModel();
      try {
        const tokenInfo = await this.api.createSession(id, secret);
        this.api.setToken(tokenInfo);

        this.router.navigate(['/users']);
        location.reload();
      } catch (err) {
        this.showAlert.set(true);
        console.error(err);
      }
      return undefined;
    });
  }
}
