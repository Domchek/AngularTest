import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-input',
  imports: [FormField],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class AppInput {
  @Input({ required: true }) name!: string;
  @Input() type: string = "text";
  @Input() field?: any;
  @Input() placeholder?: string;
  @Input() label?: string;
  @Input() errors?: any[];

  private _icon?: SafeHtml | string;
  @Input()
  set icon(value: string | undefined) {
    this._icon = value ? this.sanitizer.bypassSecurityTrustHtml(value) : undefined;
  }
  get icon(): SafeHtml | string | undefined {
    return this._icon;
  }

  constructor(private sanitizer: DomSanitizer) { }
}
