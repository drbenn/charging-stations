import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SpyImage } from '../shared/models/app.models';

//https://stackoverflow.com/questions/70281750/easy-angular-way-to-detect-if-element-is-in-viewport-on-scroll


@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {
  _mapActive:boolean;
  scrolledTargets: string[] = [];

  activeImgPath:string = './assets/img/intro/scroll-img-1.jpg';
  activeImgTop:string = '10%';
  downArrowOn:boolean = true;

  spyClass:any = {
    sec_circle_1:'section-circle',
    sec_circle_2:'section-circle',
    p_circle_2_1:'paragraph-circle',
    p_circle_2_2:'paragraph-circle',
    sec_circle_3:'section-circle',
    p_circle_3_1:'paragraph-circle',
    p_circle_3_2:'paragraph-circle',
    p_circle_3_3:'paragraph-circle',
    p_circle_3_4:'paragraph-circle',
    p_circle_3_5:'paragraph-circle',
    sec_circle_4:'section-circle',
    p_circle_4_1:'paragraph-circle',
    sec_circle_5:'section-circle',
    sec_circle_6:'section-circle',
    p_circle_6_1:'paragraph-circle',
    p_circle_6_2:'paragraph-circle',
    sec_circle_7:'section-circle',
    p_circle_7_1:'paragraph-circle',
    p_circle_7_2:'paragraph-circle',
    p_circle_7_3:'paragraph-circle',
    p_circle_7_4:'paragraph-circle',
    sec_circle_8:'section-circle',
    p_circle_8_1:'paragraph-circle',
    p_circle_8_2:'paragraph-circle',
    p_circle_8_3:'paragraph-circle',
  }

  spyImg: SpyImage[] = [
    {
      order:"1",
      path:'./assets/img/intro/scroll-img-1.jpg',
      topPosition: '10%',
    },
    {
      order:"2",
      path:'./assets/img/intro/scroll-img-2.jpg',
      topPosition: '15%',
    },
    {
      order:"3",
      path:'./assets/img/intro/scroll-img-3.jpg',
      topPosition: '20%',
    },
    {
      order:"4",
      path:'./assets/img/intro/scroll-img-4.jpg',
      topPosition: '25%',
    },
    {
      order:"5",
      path:'./assets/img/intro/scroll-img-5.jpg',
      topPosition: '30%',
    },
    {
      order:"6",
      path:'./assets/img/intro/scroll-img-6.jpg',
      topPosition: '35%',
    },
    {
      order:"7",
      path:'./assets/img/intro/scroll-img-7.jpg',
      topPosition: '40%',
    },
    {
      order:"8",
      path:'./assets/img/intro/scroll-img-8.jpg',
      topPosition: '45%',
    },
  ]

  constructor(private store: Store) { }

  ngOnInit(): void {
    const mapActiveToggle$: Observable<boolean> = this.store.select((state) => state.appState.mapView);
    mapActiveToggle$.subscribe((mapViewToggle: boolean) => {
      if (mapViewToggle) {
        this._mapActive = true;
      }
      if (!mapViewToggle) {
        this._mapActive = false;
      }
    })
  }

  // Scrollspy interaction
  onIntersection(event) {
    let eventTarget = event[0].target.id;
    let inView = event[0].isIntersecting;
    let boundY = event[0].boundingClientRect.y
    let targetStatus = [eventTarget, inView]

    this.intersectTargetToArray(inView,targetStatus)
    this.intersectTargetRemoveFromArray(inView,eventTarget,boundY)
    this.scrollspyClassToActive();
    this.scrollspyClassRemoveActive(eventTarget);
    this.scrollspyImageChange(targetStatus);
    this.downArrowStatus(eventTarget);
  }


  /**
  * ADD TO ARRAY
  * when intersection target comes into view, the circle id is pushed to array for tracking,
  * and those in array will have css class changed to active below
  */
  intersectTargetToArray(inView,targetStatus) {
    if (inView && !this.scrolledTargets.includes(targetStatus[0])) {
      this.scrolledTargets.push(targetStatus[0]);
    }
  }


  /**
   * REMOVE FROM ARRAY
   * when intersection target out of view because user has scrolled above target, the circle id
   * is removed from array so will have css class changed to (in)active
   */
  intersectTargetRemoveFromArray(inView,eventTarget,boundY) {
    if (!inView && boundY > 100) {
      let newArray = this.scrolledTargets.filter((item) => item !== eventTarget);
      this.scrolledTargets = newArray
    }
  }


  // Change class to +"-active" when included array
  scrollspyClassToActive() {
    this.scrolledTargets.forEach((target) => {
      const tLength = target.length;
      const tValue = this.spyClass[`${target}`];
      /**
       * magic # 17 is just a count length threshold from 'paragraph-circle' css class
       * which is longer than 'section-circle'...and when adding '-active' to end both
       * lengths will be > 17
       */
      // if (tValue && tValue.length < 17 && this.scrolledTargets.includes(target)) {
      if (tValue && tValue.length < 17 && this.scrolledTargets.includes(target)) {
        this.spyClass[`${target}`] += "-active";
      }
    })
  }


  // Change class to  remove "-active" when target excluded from array
  scrollspyClassRemoveActive(eventTarget) {
    this.scrolledTargets.forEach((target) => {
      const inactiveSection = 'section-circle';
      const inactiveParagraph = 'paragraph-circle'

      if (!this.scrolledTargets.includes(eventTarget) &&
          this.spyClass[`${eventTarget}`] ==='section-circle-active' ) {
            this.spyClass[`${eventTarget}`] = inactiveSection;
      }

      if (!this.scrolledTargets.includes(eventTarget) &&
          this.spyClass[`${eventTarget}`] ==='paragraph-circle-active' ) {
            this.spyClass[`${eventTarget}`] = inactiveParagraph;
      }
    })
  }


  scrollspyImageChange(targetStatus) {
    if (targetStatus[0] === 'sec_circle_1' && targetStatus[1] === true) {
      const img = this.spyImg[0];
      this.activeImgPath = img.path;
      this.activeImgTop = img.topPosition;
    }
    if (targetStatus[0] === 'sec_circle_2' && targetStatus[1] === true) {
      const img = this.spyImg[1];
      this.activeImgPath = img.path;
      this.activeImgTop = img.topPosition;
    }
    if (targetStatus[0] === 'sec_circle_3' && targetStatus[1] === true) {
      const img = this.spyImg[2];
      this.activeImgPath = img.path;
      this.activeImgTop = img.topPosition;
    }
    if (targetStatus[0] === 'sec_circle_4' && targetStatus[1] === true) {
      const img = this.spyImg[3];
      this.activeImgPath = img.path;
      this.activeImgTop = img.topPosition;
    }
    if (targetStatus[0] === 'sec_circle_5' && targetStatus[1] === true) {
      const img = this.spyImg[4];
      this.activeImgPath = img.path;
      this.activeImgTop = img.topPosition;
    }
    if (targetStatus[0] === 'sec_circle_6' && targetStatus[1] === true) {
      const img = this.spyImg[5];
      this.activeImgPath = img.path;
      this.activeImgTop = img.topPosition;
    }
    if (targetStatus[0] === 'sec_circle_7' && targetStatus[1] === true) {
      const img = this.spyImg[6];
      this.activeImgPath = img.path;
      this.activeImgTop = img.topPosition;
    }
    if (targetStatus[0] === 'sec_circle_8' && targetStatus[1] === true) {
      const img = this.spyImg[7];
      this.activeImgPath = img.path;
      this.activeImgTop = img.topPosition;
    }
  }


  downArrowStatus(eventTarget:string) {
    if (eventTarget === "down_arrow_off") {
      this.downArrowOn = false;
    }
    if (eventTarget === "down_arrow_on") {
      this.downArrowOn = true;
    }
  }

}
