import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LocationValuesInterface } from '../interfaces/location-types';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainAppComponent implements OnInit {
  constructor(
    private _location: LocationService,
    private _cdRef: ChangeDetectorRef
  ) { }


  /* ********************** */
  /* **** LOCATION VALUES **** */
  /* ********************** */
  public get isLocated(): boolean {
    return this._location.isLocated;
  }

  public locationListReversed:Observable<LocationValuesInterface[]>=this._location
  .locationListReversed$

  public locationLastValue:Observable<LocationValuesInterface>=this._location
  .locationLastValue$


  public getLocation() {
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
    return item.timestamp;
  }


  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.clearLocationObserver();
  }
}
