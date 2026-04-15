import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  @Input({ required: true }) public limit!: number;
  @Input({ required: true }) public offset!: number;
  @Input() public leftPage?: boolean;
  @Input() public rightPage?: boolean;
  @Output() onChange = new EventEmitter<boolean>();

  onBtnClick(e: boolean) {
    this.onChange.emit(e);
  }
}
