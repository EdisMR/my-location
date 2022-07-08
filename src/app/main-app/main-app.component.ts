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
    lat: -34.397,
    lng: 150.644,
  };

  constructor(
    private _location: LocationService,
    private _snackBar: MatSnackBar
  ) {}

  locationText(): string {
    return `${this.location.lat},${this.location.lng}`;
  }

  share() {
    /* navigator share */
    window.navigator
      .share({
        text: this.locationText(),
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
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
      `https://www.google.com/maps/search/?api=1&query=${this.location.lat},${this.location.lng}`,
      '_blank'
    );
  }

  getLocation() {
    this._location.getLocation().then((position) => {
      this.location.lat = position.coords.latitude;
      this.location.lng = position.coords.longitude;
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
