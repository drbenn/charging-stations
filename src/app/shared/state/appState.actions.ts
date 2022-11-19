export class LoadStations {
  static readonly type = '[Data] load station data from data service';
  constructor(public stations: any) {}
}
