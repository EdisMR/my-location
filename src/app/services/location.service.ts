import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { LocationValuesInterface, optionsForLocationInterface } from '../interfaces/location-types';
import { AlertsService } from './alerts.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService {

  constructor(
    private _alert:AlertsService
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

  private locationWatcher: number = 0;



  /* ************************ */
  /* **** POSITION OBSERVER **** */
  /* ************************ */
  private locationValuesOrigin = new BehaviorSubject<LocationValuesInterface>(this.locationValues);
  public locationValues$ = this.locationValuesOrigin.asObservable();


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
    return `Mi ubicación actual es: ${this.getCoordinatesText}`;
  }



  /* ********************* */
  /* **** PUBLIC ACTIONS **** */
  /* ********************* */
  public runObserverForLocation() {
    this._alert.message('Buscando Ubicación...');
    this.locationWatcher = navigator.geolocation.watchPosition(
      (position) => {
        this.locationValues.lat = position.coords.latitude;
        this.locationValues.lng = position.coords.longitude;
        this.locationValuesOrigin.next(this.locationValues);
      },
      (err) => {
        this._alert.error('No se pudo obtener la ubicación', 'Reintentar');
      },
      this.options
    );
  }

  public stopObserverForLocation() {
    navigator.geolocation.clearWatch(this.locationWatcher);
  }

  public shareLocation() {
    window.navigator
      .share({
        title: 'Mi Ubicación Actual',
        text: 'Mi ubicación actual',
        url: this.getLocationMapsUrl
      })
  }

  public copyTextClipboard() {
    navigator.clipboard.writeText(this.textForClipboard).then(() => {
      this._alert.success('Ubicación Copiada al Portapapeles');
    });
  }

  public openLocationOnGoogleMaps() {
    window.open(
      this.getLocationMapsUrl,
      '_blank'
    );
  }

}
