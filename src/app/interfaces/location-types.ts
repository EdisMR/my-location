export interface LocationValuesInterface {
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  speed: number;
}

export interface optionsForLocationInterface {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}
