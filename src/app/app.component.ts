import { Component } from '@angular/core';
import { TranlateServiceApp } from './services/tranlate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private _translate:TranlateServiceApp
  ) { }
}
