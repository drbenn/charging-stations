import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import { ToggleHeat, ToggleMapBlur } from '../shared/state/appState.actions';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  heatActive:boolean = true;
  mapBlur:boolean = false;
  gradientCounter: number = 0;
  gradientStyle: string = 'linear-gradient( 135deg, #79F1A4 10%, #0E5CAD 100%);'
  count: number = 0;
  countObject:Object= {'background-image':'linear-gradient( 0deg, #79F1A4 0%, #0E5CAD 68%, #fd31ff 100%)'};
  currentScale:number = 1;
  newScaleString:string;
  rotateOriginOffset:number = 0;
  rotateSpeed: string;
  scaleExpand:boolean = true;
  linearPercents:number[] = [0,25,50,75,100];
  waveExpand:boolean = true;
  filterParameter: number = 85;
  filterParamString: string = '85';
  filterExpand: boolean = true;

  dotArray = Array;
  dotCount:number = 150;


  number = 1;
  intervalId: number;

  constructor(private store: Store) { }

  ngOnInit(): void {
    const text = 'Your Text Here';
    if (typeof window !== 'undefined'){
      this.intervalId = window.setInterval(() => this.time(text), 50); // time called at ongoing interal, thus this.count +=1 to accumulate change of time
    }

  }

  time(text) {
    this.count += 1;
    let countString = String(this.count)
    // infinite rotation and scale parameters
    this.rotateOriginOffset += 0.3;
    if (this.currentScale <= 1.8 && this.scaleExpand) {
      this.currentScale += 0.01
      this.newScaleString = String(this.currentScale);
    }
    if (this.currentScale >= 1.8 ) {
      this.scaleExpand = false;
    }
    if (!this.scaleExpand && this.currentScale >= 1.2) {
      this.currentScale -= 0.01
      this.newScaleString = String(this.currentScale);
    }
    if (this.currentScale <= 1.2 ) {
      this.scaleExpand = true;
    }
    //infinite gradient wave parameters
    if (this.linearPercents[0] <= 75 && this.waveExpand) {
      this.linearPercents = this.linearPercents.map((num) => num + 1)
    }
    if (this.linearPercents[0] > 75)  {
      this.waveExpand = false;
    }
    if (this.linearPercents[0] >= -25 && !this.waveExpand) {
      this.linearPercents = this.linearPercents.map((num) => num - 1)
    }
    if (this.linearPercents[0] < -25 && !this.waveExpand) {
      this.waveExpand = true;
    }
    // infinite filter parameter
    if (this.filterParameter <= 115 && this.filterExpand) {
      this.filterParameter += 0.5;
      this.filterParamString = String(this.filterParameter);
    }
    if (this.filterParameter > 115) {
      this.filterExpand = false;
    }
    if (this.filterParameter >= 25 && !this.filterExpand) {
      this.filterParameter -= 0.5;
      this.filterParamString = String(this.filterParameter);
    }
    if (this.filterParameter < 25 && !this.filterExpand) {
      this.filterExpand = true;
    }
    // console.log(this.linearPercents);

    console.log(this.currentScale);






    // this.countObject = {'background-image':`linear-gradient( ${countString}deg, #77df94 0%, #01848f 22%, #2f4858 41%, #3bc29c 84%, #256577 100%`}
    // this.countObject = {'background-image':`radial-gradient( circle, #77df94 0%, #01848f 22%, #2f4858 41%, #3bc29c 84%, #256577 100%`, 'transform':`scale(${this.count/100})`}
    // this.countObject = {'background-image':`radial-gradient( circle, #77df94 0%, #01848f 22%, #2f4858 41%, #3bc29c 84%, #256577 100%`, 'transform':`rotate(${countString}deg) scale(${this.newScaleString})`}
    this.countObject = {'background-image':`linear-gradient(
                        ${countString}deg,
                        #77df94 ${this.linearPercents[0]}%,
                        #01848f ${this.linearPercents[1]}%,
                        #2f4858 ${this.linearPercents[2]}%,
                        #3bc29c ${this.linearPercents[3]}%,
                        #256577 ${this.linearPercents[4]}%`,
                        'transform':`rotate(${this.rotateOriginOffset}deg) scale(${this.newScaleString})`,
                        'filter': `hue-rotate(${this.filterParamString}deg)`}
    // Plan, use linear gradient with scale and rotate as is...but also adjust the gradient %'s to roll...like waves
    // console.log(countString);

  }

  mapBlurToggle() {
    this.mapBlur = !this.mapBlur;
    this.store.dispatch(new ToggleMapBlur(this.mapBlur));
  }

  heatToggle() {
    this.heatActive = !this.heatActive;
    this.store.dispatch(new ToggleHeat(this.heatActive));
  }
}
