import { Component, OnInit } from '@angular/core';
import { LocationService } from '../services/location.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.scss'],
})
export class MainAppComponent implements OnInit {
  locationValues = {
    lat: 0,
    lng: 0,
  };

  isLocated: boolean = false;
  isLoading: boolean = false;

  constructor(
    private _location: LocationService,
    private _snackBar: MatSnackBar
  ) {}

  locationText(): string {
    return `${this.locationValues.lat},${this.locationValues.lng}`;
  }

  locationMapsUrl(): string {
    return `https://maps.google.com/?q=${this.locationValues.lat},${this.locationValues.lng}`;
  }

  share() {
    /* navigator share */
    window.navigator
      .share({
        title: 'Mi Ubicación Actual',
        text: 'Mi ubicación actual',
        url: this.locationMapsUrl()
      })
  }

  copyText() {
    /* navigator clipboard */
    navigator.clipboard.writeText(this.locationText()).then(() => {
      this.openSnackBarRegular('Ubicación Copiada al Portapapeles');
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
    this.isLoading = true;
    this._location.getLocation().then((position) => {
      this.locationValues.lat = position.coords.latitude;
      this.locationValues.lng = position.coords.longitude;
      this.isLocated = true;
      this.openSnackBarSuccess('✅ Ubicación Obtenida Correctamente ');
    })
    .catch((error) => {
      this.openSnackBarError('❌ Error Obteniendo Ubicación ', 'Ok');
    })
    .finally(() => {
      this.isLoading = false;
    });
  }





  openSnackBarSuccess(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      horizontalPosition:'center',
      verticalPosition:'top',
      panelClass: ['success-snackbar','snackbar-all']
    });
  }

  openSnackBarRegular(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      horizontalPosition:'center',
      verticalPosition:'top',
      panelClass: ['regular-snackbar','snackbar-all']
    });
  }

  openSnackBarError(message: string, action: string) {
    this._snackBar.open(message, action,{
      horizontalPosition:'center',
      verticalPosition:'top',
      panelClass: ['error-snackbar','snackbar-all']
    });
  }

  ngOnInit(): void {}
}
