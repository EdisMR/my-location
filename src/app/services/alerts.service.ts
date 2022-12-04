import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  public success(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar', 'snackbar-all']
    });
  }

  public message(message: string) {
    this._snackBar.open(message, '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['regular-snackbar', 'snackbar-all']
    });
  }

  public error(message: string, actionMsg: string) {
    this._snackBar.open(message, actionMsg, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar', 'snackbar-all']
    });
  }
}
