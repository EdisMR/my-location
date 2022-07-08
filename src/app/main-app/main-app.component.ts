import { Component, OnInit } from '@angular/core';
import { LocationService } from '../services/location.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.scss'],
})
export class MainAppComponent implements OnInit {
  location = {
    lat: 0,
    lng: 0,
  };

  isLocated: boolean = false;

  constructor(
    private _location: LocationService,
    private _snackBar: MatSnackBar
  ) {}

  locationText(): string {
    return `${this.location.lat},${this.location.lng}`;
  }

  locationMapsUrl(): string {
    return `https://www.google.com/maps/search/?api=1&query=${this.location.lat},${this.location.lng}`;
  }

  share() {
    /* navigator share */
    window.navigator
      .share({
        title: 'Ubicación Actual',
        text: this.locationText(),
        url: this.locationMapsUrl()
      })
      .then(() => true)
      .catch((error) => true);
  }

  copyText() {
    /* navigator clipboard */
    navigator.clipboard.writeText(this.locationText()).then(() => {
      this.openSnackBar('Ubicación Copiada al Portapapeles', '');
    });
  }

  openOnGoogleMaps() {
    /* navigator open */
    window.open(
      this.locationMapsUrl(),
      '_blank'
    );
  }

  getLocation() {
    this._location.getLocation().then((position) => {
      this.location.lat = position.coords.latitude;
      this.location.lng = position.coords.longitude;
      this.isLocated = true;
      this.openSnackBar('Ubicación Obtenida Correctamente', '');
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  ngOnInit(): void {}
}
