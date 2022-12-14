import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocationValuesInterface, optionsForLocationInterface } from '../interfaces/location-types';
import { AlertsService } from './alerts.service';
import { TranlateServiceApp } from './tranlate.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService {

  constructor(
    private _alert: AlertsService,
    private _translateSvc: TranlateServiceApp
  ) { }

  /* ******************* */
  /* **** MAIN VALUES **** */
  /* ******************* */

  private options: optionsForLocationInterface = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
  };

  private locationWatcher: any

  private locationListSource: LocationValuesInterface[] = [];
  private locationListSourceReversed: LocationValuesInterface[] = [];

  private locationList: BehaviorSubject<LocationValuesInterface[]> = new BehaviorSubject<LocationValuesInterface[]>(this.locationListSource);
  public locationList$: Observable<LocationValuesInterface[]> = this.locationList.asObservable();

  private locationListReversed: BehaviorSubject<LocationValuesInterface[]> = new BehaviorSubject<LocationValuesInterface[]>(this.locationListSourceReversed);
  public locationListReversed$: Observable<LocationValuesInterface[]> = this.locationListReversed.asObservable();

  private locationLastValue: BehaviorSubject<LocationValuesInterface> = new BehaviorSubject<LocationValuesInterface>({} as LocationValuesInterface);
  public locationLastValue$: Observable<LocationValuesInterface> = this.locationLastValue.asObservable();

  private isLocated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLocated$: Observable<boolean> = this.isLocated.asObservable();


  /* ****************** */
  /* **** GET VALUES **** */
  /* ****************** */
  private get getCoordinatesSourceText(): string {
    let locationLastValueTemp: LocationValuesInterface = this.locationLastValue.getValue();
    return `${locationLastValueTemp.latitude},${locationLastValueTemp.longitude}`;
  }

  private get getLocationMapsUrl(): string {
    let locationLastValueTemp: LocationValuesInterface = this.locationLastValue.getValue();
    return `https://maps.google.com/?q=${locationLastValueTemp.latitude},${locationLastValueTemp.longitude}`;
  }



  /* ********************* */
  /* **** PUBLIC ACTIONS **** */
  /* ********************* */
  public runObserverForLocation(): void {
    this.stopObserverForLocation();

    let messageLocating: string = this._translateSvc.getOneText('locating');
    this._alert.message(messageLocating);

    this.locationListSource = [];
    this.locationListSourceReversed = [];
    this.locationList.next(this.locationListSource);
    this.locationListReversed.next(this.locationListSourceReversed);
    this.locationLastValue.next({} as LocationValuesInterface);
    this.isLocated.next(false);

    this.locationWatcher = navigator.geolocation.watchPosition(
      (position: any) => {
        this.locationDataSuccess(position);
      },
      (err) => {
        let messageErrorLocating: string = this._translateSvc.getOneText('error-locating');
        this._alert.error(messageErrorLocating, 'Ok');
      },
      this.options
    );
  }

  private locationDataSuccess(position: any) {
    /* prevent emit last value */
    let lastValue: LocationValuesInterface = this.locationLastValue.getValue();
    if (lastValue.latitude !== position.coords.latitude && lastValue.longitude !== position.coords.longitude) {

      let parsedAccuracy: number = position.coords.accuracy ? parseFloat(position.coords.accuracy.toFixed(2)) : 0;
      let parsedAltitude: number = position.coords.altitude ? parseFloat(position.coords.altitude.toFixed(2)) : 0;
      let parsedAltitudeAccuracy: number = position.coords.altitudeAccuracy ? parseFloat(position.coords.altitudeAccuracy.toFixed(2)) : 0;
      let parsedHeading: number = position.coords.heading ? parseFloat(position.coords.heading.toFixed(2)) : 0;
      let parsedSpeed: number = position.coords.speed ? parseFloat(position.coords.speed.toFixed(2)) : 0;

      let data = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: parsedAccuracy,
        altitude: parsedAltitude,
        altitudeAccuracy: parsedAltitudeAccuracy,
        heading: parsedHeading,
        speed: parsedSpeed,
        timestamp: position.timestamp
      }

      this.locationListSource.push(data);
      this.locationListSourceReversed.unshift(data);
      this.locationList.next(this.locationListSource);
      this.locationListReversed.next(this.locationListSourceReversed);
      this.locationLastValue.next(data);
      this.isLocated.next(true);
    }
  }

  public stopObserverForLocation() {
    navigator.geolocation.clearWatch(this.locationWatcher);
  }

  public shareLocation() {
    let messageMyCurrentLocation: string = this._translateSvc.getOneText('my-current-location');
    window.navigator
      .share({
        title: messageMyCurrentLocation,
        text: `${messageMyCurrentLocation}: ${this.getCoordinatesSourceText}`,
        url: this.getLocationMapsUrl
      })
  }

  public copyTextClipboard() {
    let messageCopiedLocation: string = this._translateSvc.getOneText('copied-location');
    navigator.clipboard.writeText(this.getCoordinatesSourceText).then(() => {
      this._alert.success(messageCopiedLocation);
    });
  }

  public openLocationOnGoogleMaps() {
    window.open(
      this.getLocationMapsUrl,
      '_blank'
    );
  }

}
