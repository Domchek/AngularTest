import { Component, Input } from '@angular/core';
//import { RouterLink, RouterLinkActive } from '@angular/router';
import { Brand } from '../brand/brand';

@Component({
  selector: 'navbar',
  imports: [Brand],//RouterLink, RouterLinkActive, 
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar { } // TODO: Logout
