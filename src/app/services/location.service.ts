import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocationService {

  public getLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position);
      });
    });
  }

  constructor() {}
}
