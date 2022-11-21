import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
  })

export class MapService {


  // public coordinateFormatter(coords:any): number[] {
  //   let something = coords
  //   let newLat;
  //   let newLng;
  //   let newCoords:number[] = [0,0];

  //   return newCoords;
  //   }

    // create basic tooltip

  public createTooltip(data: any): HTMLElement {
    let stationTooltip = document.createElement('div');
    stationTooltip.setAttribute('style' , 'width: 300px; transform: translateX(-20px);')
    stationTooltip.innerHTML = `
    <div class="tooltip-container">
     <div>Name: ${data.name}</div>
     <div>Location: ${data.address}, ${data.city}, ${data.state} ${data.zip}</div>
     <div> Connections: ${data.connectorTypes}</div>
     <div>${data.accessType} - accessible ${data.accessTime}</div>
     <div>Owner: ${data.owner}</div>
     <div>Network: ${data.network}</div>
    </div>
    `;
    return stationTooltip;
  }

}
