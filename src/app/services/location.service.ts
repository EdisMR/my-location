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
    private _translateSvc:TranlateServiceApp
  ) { }

  /* ******************* */
  /* **** MAIN VALUES **** */
  /* ******************* */

  private options: optionsForLocationInterface = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0,
  };

  private locationValues: LocationValuesInterface = {
    lat: 0,
    lng: 0,
  };

  private locationWatcher: any

  isLocated: boolean = false;

  /* ************************ */
  /* **** POSITION OBSERVER **** */
  /* ************************ */
  private locationValuesCompleteInfoSource: any = {
    latitude: 0,
    longitude: 0,
  };
  private locationValuesCompleteInfo: BehaviorSubject<any> = new BehaviorSubject<any>(this.locationValuesCompleteInfoSource);
  public getCompleteInfoLocation$: Observable<any> = this.locationValuesCompleteInfo.asObservable();

  /* ****************** */
  /* **** GET VALUES **** */
  /* ****************** */
  private get getCoordinatesText(): string {
    return `${this.locationValues.lat},${this.locationValues.lng}`;
  }

  private get getLocationMapsUrl(): string {
    return `https://maps.google.com/?q=${this.locationValues.lat},${this.locationValues.lng}`;
  }

  private get textForClipboard(): string {
    let initialText:string=this._translateSvc.getOneText('my-current-location-is');
    return `${initialText}: ${this.getCoordinatesText}`;
  }



  /* ********************* */
  /* **** PUBLIC ACTIONS **** */
  /* ********************* */
  public runObserverForLocation(): void {
    this.stopObserverForLocation();
    let messageLocating:string=this._translateSvc.getOneText('locating');
    this._alert.message(messageLocating);
    this.locationWatcher = navigator.geolocation.watchPosition(
      (position) => {
        this.locationValuesCompleteInfoSource = position.coords;
        this.locationValues.lat = position.coords.latitude;
        this.locationValues.lng = position.coords.longitude;
        this.locationValuesCompleteInfo.next(this.locationValuesCompleteInfoSource);
        this.isLocated = true;
      },
      (err) => {
        let messageErrorLocating:string=this._translateSvc.getOneText('error-locating');
        this._alert.error(messageErrorLocating,'Ok');
      },
      this.options
    );
  }

  public stopObserverForLocation() {
    navigator.geolocation.clearWatch(this.locationWatcher);
  }

  public shareLocation() {
    let messageMyCurrentLocation:string=this._translateSvc.getOneText('my-current-location');
    window.navigator
      .share({
        title: messageMyCurrentLocation,
        text: this.textForClipboard,
        url: this.getLocationMapsUrl
      })
  }

  public copyTextClipboard() {
    let messageCopiedLocation:string=this._translateSvc.getOneText('copied-location');
    navigator.clipboard.writeText(this.textForClipboard).then(() => {
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
