import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'brand',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './brand.html',
  styleUrl: './brand.css',
})
export class Brand { }
