import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import { ToggleHeat, ToggleMapView } from '../shared/state/appState.actions';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  //sound props
  audio: any;
  musicPath: string = "/assets/sound/music.webm";
  soundImgName: string = "audio-3-off";

  //heat prop
  heatActive:boolean = true;

  //map prop
  mapActive:boolean = false;


  //gradient props
  gradientCounter: number = 0;
  // gradientStyle: string = 'linear-gradient( 135deg, #79F1A4 10%, #0E5CAD 100%);';
  gradientTime: number = 0;
  gradientObject:Object= {'background-image':'linear-gradient( 0deg, #79F1A4 0%, #0E5CAD 68%, #fd31ff 100%)'};
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

  // gradient dot props
  dotArray = Array;
  dotCount:number = 150;
  number = 1;
  intervalId: number;

  constructor(private store: Store) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined'){
      this.intervalId = window.setInterval(() => this.gradientLoop(), 50); // time called at ongoing interal, thus this.count +=1 to accumulate change of time
    }
  }


  private gradientLoop() {
    this.gradientTime += 1;

    // infinite rotation and scale parameters
    this.rotateAndScaleGradientLoop();

    //infinite gradient wave parameters
    this.gradientWaveLoop();

    // infinite filter parameter
    this.gradientFilterLoop();

    this.updateLinearGradientString();

  }

  protected toIntro() {
    this.mapActive = false;
    this.store.dispatch(new ToggleMapView(this.mapActive))
  }

  protected toMap() {
    this.mapActive = true;
    this.store.dispatch(new ToggleMapView(this.mapActive))
  }


  protected heatToggle() {
    this.heatActive = !this.heatActive;
    this.store.dispatch(new ToggleHeat(this.heatActive));
  }


  protected soundToggle() {
    if (!this.audio) {
      this.audio = new Audio();
    }

    this.audio.src = this.musicPath;
    const strLen = this.soundImgName.length;
    const last3 = this.soundImgName.slice(strLen -3,strLen);

    // switch audio on
    if (last3 === "off") {
      this.soundImgName = this.soundImgName.slice(0, strLen -3) + "on"
      this.audio.load();
      this.audio.loop = true;
      this.audio.muted = false;
      this.audio.play();
    }

    // switch audio off
    if (last3 !== "off") {
      this.soundImgName = this.soundImgName.slice(0, strLen -2) + "off";
      this.audio.muted = true;
    }
  }


  private rotateAndScaleGradientLoop() {
    this.rotateOriginOffset += 0.3;
    if (this.currentScale <= 1.4 && this.scaleExpand) {
      this.currentScale += 0.01;
      this.newScaleString = String(this.currentScale);
    }
    if (this.currentScale >= 1.4 ) {
      this.scaleExpand = false;
    }
    if (!this.scaleExpand && this.currentScale >= 1.0) {
      this.currentScale -= 0.01;
      this.newScaleString = String(this.currentScale);
    }
    if (this.currentScale <= 1.0 ) {
      this.scaleExpand = true;
    }
  }


  private gradientWaveLoop() {
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
  }


  private gradientFilterLoop() {
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
  }

  private updateLinearGradientString() {
    let countString = String(this.gradientTime)

    this.gradientObject = {'background-image':`linear-gradient(
      ${countString}deg,
      #77df94 ${this.linearPercents[0]}%,
      #01848f ${this.linearPercents[1]}%,
      #2f4858 ${this.linearPercents[2]}%,
      #3bc29c ${this.linearPercents[3]}%,
      #256577 ${this.linearPercents[4]}%`,
      'transform':`rotate(${this.rotateOriginOffset}deg) scale(${this.newScaleString})`,
      'filter': `hue-rotate(${this.filterParamString}deg)`}
  }

}
