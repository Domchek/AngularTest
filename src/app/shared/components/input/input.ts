import { Component, Input } from '@angular/core';
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
}
