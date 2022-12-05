import { Component, OnInit } from '@angular/core';
import { TranlateServiceApp } from '../services/tranlate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private _translate: TranlateServiceApp
  ) { }

  get selectedLanguage(){
    return this._translate.currentLang;
  }

  changeLanguage(evt:any){
    this._translate.chooseLang(evt.value);
  }

  ngOnInit(): void {
  }

}
