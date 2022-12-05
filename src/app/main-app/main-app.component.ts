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
  isLocated: boolean = false;

  locationList: LocationValuesInterface[] = [];

  public get lastValueLocationList():{lat: number, lng: number} {
    return this.locationList[this.locationList.length - 1];
  }

  locationValuesCompleteInfo: any = {};
  locationCompleteValues = this._location.getCompleteInfoLocation$
    .subscribe((locationValues: any) => {
      this.locationValuesCompleteInfo = locationValues
      this.locationList.push({
        lat: locationValues.latitude,
        lng: locationValues.longitude,
      })
      this.isLocated = true;
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
