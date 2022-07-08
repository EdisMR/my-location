import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  public getLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          reject(error);
        },
        this.options
      );
    });
  }

  constructor() {}
}
