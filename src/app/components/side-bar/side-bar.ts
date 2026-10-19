import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-side-bar',
  templateUrl: './side-bar.html',
})
export class SideBar {}
