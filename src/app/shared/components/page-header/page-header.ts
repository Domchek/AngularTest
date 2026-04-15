import { Component, Input } from '@angular/core';

@Component({
  selector: 'page-header',
  imports: [],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  @Input({ required: true }) public title!: string;
  @Input() public subtitle?: string;
  constructor() {

  }
}
