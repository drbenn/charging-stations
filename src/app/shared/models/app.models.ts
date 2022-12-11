export interface StationModel {
  name: string,
  lat: number,
  lng: number,
  address: string,
  city: string,
  state: string,
  zip: string,
  accessType:string,
  accessTime:string,
  fuelType: string,
  connectorTypes: string[],
  owner: string,
  status: string,
  network: string,
  pricing: string,
}


export interface FilterListObject {
  connectors: string[],
  networks: string[],
  costs: string[],
}

export interface SpyImage {
  order:string,
  path:string,
  topPosition: string,
}
