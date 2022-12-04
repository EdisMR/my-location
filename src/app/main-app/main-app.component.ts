import { Component, OnInit } from '@angular/core';
import { LocationService } from '../services/location.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocationValuesInterface } from '../interfaces/location-types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.scss'],
})
export class MainAppComponent implements OnInit {
  constructor(
    private _location: LocationService,
    private _snackBar: MatSnackBar
  ) { }


  /* ********************** */
  /* **** LOCATION VALUES **** */
  /* ********************** */
  locationValues: LocationValuesInterface = {} as LocationValuesInterface;

  locationSubscription: Subscription = this._location.locationValues$
    .subscribe((locationValues: LocationValuesInterface) => {
      this.locationValues = locationValues
    })

  isLocated: boolean = false;





  getLocation() {
    this._location.runObserverForLocation();
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
