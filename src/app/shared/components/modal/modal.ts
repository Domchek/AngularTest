import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  @Input() public title?: string;
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }
}
