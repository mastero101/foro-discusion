import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidenavbarComponent } from './sidenavbar/sidenavbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SidenavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Frontend';
}
