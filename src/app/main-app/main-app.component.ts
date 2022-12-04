import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocationValuesInterface } from '../interfaces/location-types';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.scss'],
})
export class MainAppComponent implements OnInit {
  constructor(
    private _location: LocationService,
  ) { }


  /* ********************** */
  /* **** LOCATION VALUES **** */
  /* ********************** */
  locationValues: LocationValuesInterface = {} as LocationValuesInterface;

  locationSubscription: Subscription = this._location.locationValues$
    .subscribe((locationValues: LocationValuesInterface) => {
      this.locationValues = locationValues
      this.isLocated = true;
    })

  isLocated: boolean = false;

  locationValuesCompleteInfo: any = {};
  locationCompleteValues = this._location.getCompleteInfoLocation$
    .subscribe((locationValues: any) => {
      this.locationValuesCompleteInfo = locationValues
    })



  getLocation() {
    this.clearLocationObserver();
    this._location.runObserverForLocation()
  }

  clearLocationObserver() {
    this._location.stopObserverForLocation();
  }

  openOnGoogleMaps() {
    this._location.openLocationOnGoogleMaps();
  }

  copyText() {
    this._location.copyTextClipboard();
  }

  shareLocation() {
    this._location.shareLocation();
  }



  ngOnInit(): void { }
}
