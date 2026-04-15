import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ButtonAction } from '../../model/buttonAction';

@Component({
  selector: 'button-grid',
  imports: [],
  templateUrl: './button-grid.html',
  styleUrl: './button-grid.css',
})
export class ButtonGrid {
  private _actions: ButtonAction[] = [];

  @Input({ required: true })
  set actions(value: ButtonAction[]) {
    this._actions = (value ?? []).map(e => ({
      ...e,
      icon: typeof e.icon === 'string' ? this.sanitizer.bypassSecurityTrustHtml(e.icon) : e.icon
    }));
  }
  get actions(): ButtonAction[] {
    return this._actions;
  }

  @Output() onClick = new EventEmitter<string>();

  constructor(private sanitizer: DomSanitizer) { }

  onBtnClick(e: string) {
    this.onClick.emit(e);
  }
}
