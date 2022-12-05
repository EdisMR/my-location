import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranlateServiceApp {

  constructor(
    private _translate: TranslateService,
  ) {
    this.setLang();
  }

  private setLang() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      this._translate.use(savedLang);
    }else{
      if(navigator.language.includes('es')){
        this._translate.use('es');
      }else{
        this._translate.use('en');
      }
    }
  }

  public chooseLang(lang: 'es' | 'en') {
    this._translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  public get currentLang() {
    return this._translate.currentLang;
  }

  public getOneText(index:string) {
    return this._translate.instant(index);
  }

}
