import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'search-input',
  imports: [],
  templateUrl: './search-input.html',
  styleUrl: './search-input.css',
})
export class SearchInput {
  // @Input({ required: true }) public value!: string;
  @Input() public placeholder?: string;
  @Output() onSearch = new EventEmitter<string>();

  onChange(event: any) {
    this.onSearch.emit(event.target.value);
  }
}
