import { Component, signal } from '@angular/core';
import { SideBar } from './components/side-bar/side-bar';
import { RouterOutlet } from '@angular/router';
@Component({
  imports: [SideBar, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('bom-jesus-app');
}
