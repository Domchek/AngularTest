import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './app-button.html',
  styleUrl: './app-button.css',
})
export class AppButton {
  @Input() public variant: "primary" | "secondary";
  @Input({ required: true }) public text: string;
  @Input() public type: string;
  @Input() public disabled?: boolean;
  @Output() onClick = new EventEmitter<any>();

  constructor() {
    this.variant = "primary";
    this.text = "";
    this.type = "button";
  }

  onClickBtn(event: any) {
    this.onClick.emit(event);
  }
}
