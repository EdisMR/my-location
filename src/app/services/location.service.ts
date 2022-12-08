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

  private locationWatcher: any

  public isLocated: boolean = false;

  private locationListSource: LocationValuesInterface[] = [];
  private get locationListSourceReversed(): LocationValuesInterface[] {
    return this.locationListSource.reverse();
  }
  private locationListReversed:BehaviorSubject<LocationValuesInterface[]> = new BehaviorSubject<LocationValuesInterface[]>(this.locationListSourceReversed);
  public locationListReversed$:Observable<LocationValuesInterface[]> = this.locationListReversed.asObservable();

  private locationLastValue:BehaviorSubject<LocationValuesInterface> = new BehaviorSubject<LocationValuesInterface>({} as LocationValuesInterface);
  public locationLastValue$:Observable<LocationValuesInterface> = this.locationLastValue.asObservable();




  /* ****************** */
  /* **** GET VALUES **** */
  /* ****************** */
  private get getCoordinatesSourceText(): string {
    let locationLastValueTemp:LocationValuesInterface = this.locationLastValue.getValue();
    return `${locationLastValueTemp.latitude},${locationLastValueTemp.longitude}`;
  }

  private get getLocationMapsUrl(): string {
    let locationLastValueTemp:LocationValuesInterface = this.locationLastValue.getValue();
    return `https://maps.google.com/?q=${locationLastValueTemp.latitude},${locationLastValueTemp.longitude}`;
  }



  /* ********************* */
  /* **** PUBLIC ACTIONS **** */
  /* ********************* */
  public runObserverForLocation(): void {
    console.log('runObserverForLocation()');
    this.stopObserverForLocation();

    let messageLocating:string=this._translateSvc.getOneText('locating');
    this._alert.message(messageLocating);

    this.locationWatcher = navigator.geolocation.watchPosition(
      (position:any) => {
        /* prevent emit last value */
        let lastValue:LocationValuesInterface = this.locationLastValue.getValue();
        if (lastValue.latitude !== position.coords.latitude && lastValue.longitude !== position.coords.longitude) {

          let parsedAccuracy:number = parseFloat(position.coords.accuracy.toFixed(2));
          let parsedAltitude:number = parseFloat(position.coords.altitude.toFixed(2));
          let parsedAltitudeAccuracy:number = parseFloat(position.coords.altitudeAccuracy.toFixed(2));
          let parsedHeading:number = parseFloat(position.coords.heading.toFixed(2));
          let parsedSpeed:number = parseFloat(position.coords.speed.toFixed(2));
          this.locationListSource.push({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: parsedAccuracy,
            altitude: parsedAltitude,
            altitudeAccuracy: parsedAltitudeAccuracy,
            heading: parsedHeading,
            speed: parsedSpeed,
            timestamp: position.timestamp
          });
          this.locationListReversed.next(this.locationListSourceReversed);
          this.locationLastValue.next(position.coords);
        }
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
        text: `${messageMyCurrentLocation}: ${this.getCoordinatesSourceText}`,
        url: this.getLocationMapsUrl
      })
  }

  public copyTextClipboard() {
    let messageCopiedLocation:string=this._translateSvc.getOneText('copied-location');
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
