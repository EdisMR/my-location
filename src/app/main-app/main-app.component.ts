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

  private locationList: LocationValuesInterface[] = [];

  public get lastValueLocationList(): { lat: number, lng: number } {
    if (this.locationList.length > 0) {
      let lastValue = this.locationList[this.locationList.length - 1];
      return lastValue
    }
    return { lat: 0, lng: 0 }
  }

  public get reverseLocationList(): { lat: number, lng: number }[] {
    return this.locationList.reverse();
  }



  /* OBTAIN COMPLETE INFO FROM LOCATION SERVICE */
  public locationValuesCompleteInfo: any = {};
  private locationCompleteValuesSubscription = this._location.getCompleteInfoLocation$
    .subscribe((locationValues: any) => {
      this.locationValuesCompleteInfo = locationValues
      if (this.locationValuesCompleteInfo.latitude != 0 && this.locationValuesCompleteInfo.longitude != 0) {
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
        } else {
          this.locationList.push({
            lat: locationValues.latitude,
            lng: locationValues.longitude
          });
        }
      }
    })



  public getLocation() {
    this.clearLocationObserver();
    this._location.runObserverForLocation()
  }

  private clearLocationObserver() {
    this._location.stopObserverForLocation();
  }

  public openOnGoogleMaps() {
    this._location.openLocationOnGoogleMaps();
  }

  public copyText() {
    this._location.copyTextClipboard();
  }

  public shareLocation() {
    this._location.shareLocation();
  }

  public trackByFn(index: any, item: any) {
    return index;
  }


  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.clearLocationObserver();
    this.locationCompleteValuesSubscription?.unsubscribe();
  }
}
