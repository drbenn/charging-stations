import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

//https://stackoverflow.com/questions/70281750/easy-angular-way-to-detect-if-element-is-in-viewport-on-scroll


@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit {
  _mapActive:boolean;
  scrolledTargets: string[] = [];

  spyClass = {
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
    let ratio = event[0].intersectionRatio;
    let boundY = event[0].boundingClientRect.y
    let targetStatus = [eventTarget, inView]
    let yLag = boundY + 200;
    console.log(event[0]);

    /**
     * ADD TO ARRAY
     * when intersection target comes into view, the circle id is pushed to array for tracking,
     * and those in array will have css class changed to active below
     */
    if (inView && !this.scrolledTargets.includes(targetStatus[0])) {
      this.scrolledTargets.push(targetStatus[0]);
    }

    /**
     * REMOVE FROM ARRAY
     * when intersection target out of view because user has scrolled above target, the circle id
     * is removed from array so will have css class changed to (in)active
     */
    if (!inView && boundY > 100) {
      let newArray = this.scrolledTargets.filter((item) => item !== eventTarget);
      this.scrolledTargets = newArray
    }

    // Change class to +"-active" when included array
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


  //  Change class to  remove "-active" when target excluded from array - BAD
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

}
