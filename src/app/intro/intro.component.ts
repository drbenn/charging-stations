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
  @ViewChild('sec_circle_1', {static: true}) sec_circle_1: ElementRef;
  testClass = 'paragraph-circle'

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


  _mapActive:boolean;

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



  onIntersection(event) {
    let eventTarget = event[0].target.id;
    let className = event[0].target.className;
    let inView = event[0].isIntersecting;
    let ratio = event[0].intersectionRatio;
    let boundY = event[0].boundingClientRect.y
    let targetStatus = [eventTarget, inView]
    // console.log(targetStatus);



    /**
     * ADD TO ARRAY - GOOD
     * when intersection target comes into view, the circle id is pushed to array for tracking,
     * and those in array will have css class changed to active below
     */
    if (inView && !this.scrolledTargets.includes(targetStatus[0])) {
      this.scrolledTargets.push(targetStatus[0]);
      if (eventTarget === "sec_circle_2") {
        console.log('adding');

        console.log(event[0]);

      }
      console.log(this.scrolledTargets);
    }

    /**
     * PROBLEM - RANDOMLY REMOVING FROM ARRAY - FIXED?!
     * REMOVE FROM ARRAY - GOOD
     * when intersection target out of view because user has scrolled above target, the circle id
     * is removed from array so will have css class changed to (in)active
     */
    if (!inView && boundY > 100) {
      let newArray = this.scrolledTargets.filter((item) => item !== eventTarget);
      this.scrolledTargets = newArray
      if (eventTarget === "sec_circle_2") {
        console.log('removing');
        console.log(event[0]);

      }
      console.log(this.scrolledTargets);

    }

    // Change class to +"-active" when included array - GOOD
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
      // const tLength = target.length;
      let tValue = this.spyClass[`${eventTarget}`];

      if (!this.scrolledTargets.includes(eventTarget)) {
        console.log('SHIT');
        // console.log(tLength);
        console.log(eventTarget);

        console.log(tValue);
        // removal is registered, now need to remove "-active" from class
        console.log(this.spyClass[`${target}`]);
        let classNameLength:number = this.spyClass[`${target}`].length
        let activeRemovedLength:number = classNameLength - 7 // 7 === "-active".length
        console.log(classNameLength);
        let updatedClassName: string = this.spyClass[`${target}`].substring(0,activeRemovedLength)
        console.log(`updatedClassName: ${updatedClassName}`);
        this.spyClass[`${eventTarget}`] = updatedClassName;

      }



    })

      /**
       * If intersected target is out of view and the viewport is above the id(boundY > 0)
       * instead of below(user still reading down), then remove "-active" from the targets
       * class, and remove from the scrolledTargets array
       */
      // if (target === "p_circle_3_2") {
      // console.log('------------------------------------------------------------------');
      // console.log(target);
      // console.log(targetStatus[1]);
      // console.log(boundY);
      // console.log(ratio);
      // console.log('------------------------------------------------------------------');
      // }

      // if (tValue && tValue.length > 17 && !inView && boundY > 0 && ratio < 0.5) {
      //   // console.log(`HERROOOO : ${tValue}`);
      //   // console.log(event[0]);
      //   const newEndIndex = tValue.length - 7;
      //   const inactiveStyle:string = this.spyClass[`${target}`].substring(0, newEndIndex)
      //   // const inactiveStyle:string = activeStyle.substring(0, newEndIndex)
      //   // console.log(inactiveStyle);

      //   this.spyClass[`${target}`] = inactiveStyle;


      // }
    //   console.log(`TARGET: ${eventTarget}`);
    //   console.log(this.scrolledTargets);

    //   this.scrolledTargets.forEach((target) => {
    //     const tLength = target.length;
    //     const tValue = this.spyClass[`${target}`];
    //   if (tValue && tValue.length > 17 && !this.scrolledTargets.includes(target)) {
    //     console.log("WHHHHAAAMMMMOOO");

    //     const newEndIndex = tValue.length - 5;
    //     const inactiveStyle:string = this.spyClass[`${target}`].substring(0, newEndIndex)
    //     console.log(`INACTIVE STYLE: ${inactiveStyle}`);

    //   }
    // })


  }

}
