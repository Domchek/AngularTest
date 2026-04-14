import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './app-button.html',
  styleUrl: './app-button.css',
})
export class AppButton {
  @Input() public type: "primary" | "secondary";
  @Input({ required: true }) public text: string;
  @Output() onClick = new EventEmitter<any>();

  constructor() {
    this.type = "primary";
    this.text = "";
  }

  onClickBtn(event: any) {
    this.onClick.emit(event);
  }
}
