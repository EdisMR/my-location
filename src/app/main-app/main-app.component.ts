import { Component, OnInit } from '@angular/core';
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
  public get isLocated(): boolean {
    return this._location.isLocated;
  }

  locationList: LocationValuesInterface[] = [];

  public get lastValueLocationList(): { lat: number, lng: number } {
    if (this.locationList.length > 0) {
      let lastValue = this.locationList[this.locationList.length - 1];
      return lastValue
    }
    return { lat: 0, lng: 0 }
  }

  locationValuesCompleteInfo: any = {};
  locationCompleteValues = this._location.getCompleteInfoLocation$
    .subscribe((locationValues: any) => {
      this.locationValuesCompleteInfo = locationValues
      if (this.locationValuesCompleteInfo.latitude!=0 && this.locationValuesCompleteInfo.longitude!=0) {
        /* avoid repeating last value */
        if (this.locationList.length > 0) {
          let lastValue = this.locationList[this.locationList.length - 1];
          let newValue = {
            lat: locationValues.latitude,
            lng: locationValues.longitude
          }
          if (lastValue.lat !== newValue.lat && lastValue.lng !== newValue.lng) {
            this.locationList.push(newValue);
          }
        }else{
          this.locationList.push({
            lat: locationValues.latitude,
            lng: locationValues.longitude
          });
        }
      }
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

  trackByFn(index: any, item: any) {
    return index;
  }


  ngOnInit(): void { }
}
