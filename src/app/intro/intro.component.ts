import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

//https://stackoverflow.com/questions/70281750/easy-angular-way-to-detect-if-element-is-in-viewport-on-scroll


@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit, AfterViewInit{
  @ViewChild('sec_circle_1', {static: true}) sec_circle_1: ElementRef;
  testClass = 'paragraph-circle'

  spyClass = {
    sec_circle_1:'section_circle',
    sec_circle_2:'section_circle',
    sec_circle_3:'section_circle',
    sec_circle_4:'section_circle',
    sec_circle_5:'section_circle',
    sec_circle_6:'section_circle',
    sec_circle_7:'section_circle',
    sec_circle_8:'section_circle',
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

  ngAfterViewInit(): void {
    // const threshold = 0.2; // how much % of the element is in view
    // const observer = new IntersectionObserver(
    //     (entries) => {
    //       console.log(entries);

    //         entries.forEach((entry) => {
    //             if (entry.isIntersecting) {
    //               console.log('BOOYAH');
    //               console.log(entry);


    //                 // run your animation code here
    //                 observer.disconnect(); // disconnect if you want to stop observing else it will rerun every time its back in view. Just make sure you disconnect in ngOnDestroy instead
    //                 console.log('UNDO BOOYAH');

    //             }
    //         });
    //     },
    //     { threshold }
    // );
    // observer.observe(this.sec_circle_1.nativeElement);
  }

  onIntersection(event) {
    // console.log(event[0].target.id);
    let target = event[0].target.id
    let inView = event[0].isIntersecting;
    let ratio = event[0].intersectionRatio;
    let boundY = event[0].boundingClientRect.y
    let jabba = [target, inView]
    // console.log(jabba);

    if (jabba[0] === "p_circle_7_2" && !inView && boundY > 0) {
      this.testClass = 'paragraph-circle'
      // console.log(event);
      console.log(`NOT : ${ratio}`);


    }

    if (jabba[0] === "p_circle_7_2" && inView) {
      this.testClass = 'paragraph-circle-active'
      console.log(`YES: ${ratio}`);



    }
    // console.log(event);
    // console.log(boundY);

    // if (jabba[0] === "p_circle_3_1" && inView) {
    //   this.testClass = 'paragraph-circle-active'
    //   console.log(`YES: ${ratio}`);
    //   // console.log(target[0]);
    //   // console.log(target[11]);
    //   // console.log(target[13]);
    //   console.log(this.testClass.length);
    // }


  }

}
