import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Brand } from '../brand/brand';

@Component({
  selector: 'navbar',
  imports: [RouterLink, RouterLinkActive, Brand],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input({ required: true }) links!: { path: string, label: string }[];
}
