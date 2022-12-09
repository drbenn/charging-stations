import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FilterListObject } from 'src/app/shared/models/app.models';
import { UpdateSelectedFilterOptions } from 'src/app/shared/state/appState.actions';
// import { DropDownFilterList } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-filter-pane',
  templateUrl: './filter-pane.component.html',
  styleUrls: ['./filter-pane.component.scss']
})
export class FilterPaneComponent implements OnInit {
  burgerClasses= ['line-1', 'line-2', 'line-3'];
  // allObject: DropDownFilterList = {value: 'all',checked : true,viewName: 'All'};
  // connectorOptions: DropDownFilterList[] = [this.allObject];
  // networkOptions: DropDownFilterList[] = [this.allObject];
  // costOptions: DropDownFilterList[] = [
  //   this.allObject,
  //   {value: 'charge',checked : true, viewName: 'Charge'},
  //   {value: 'free',checked : true,viewName: 'Free'}
  //   ]
  // connectorOptions: DropDownFilterList[] = [];
  // networkOptions: DropDownFilterList[] = [];
  // costOptions: DropDownFilterList[] = [
  //   {value: 'charge',checked : true, viewName: 'Charge'},
  //   {value: 'free',checked : true,viewName: 'Free'}
  //   ]

  // @Input() list:any[];

  // @Output() shareCheckedList = new EventEmitter();
  // @Output() shareIndividualCheckedList = new EventEmitter();


  // checkedList : any[];
  // currentSelected : {};
  // showDropDownConnector: boolean = false;
  // showDropDownNetwork: boolean = false;
  // showDropDownCost: boolean = false;



  connectorOptions: string[] = [];
  networkOptions: string[] = [];
  costOptions: string[] = [];

  selectedOptions: string[] = [];

  // selectedFilters: string[] = ["Charge", "Free"]

  constructor(
    private store: Store
  ) {
    // this.checkedList = ["Charge", "Free"];
  }

  ngOnInit(): void {
    let filterOptions$: Observable<FilterListObject> = this.store.select(
      (state) => state.appState.filterOptions);

    filterOptions$.subscribe((_filterOptions:FilterListObject) => {
      if (_filterOptions && this.connectorOptions.length === 0) {
        console.log(_filterOptions);

        // Set filter options available for UI
        this.connectorOptions = _filterOptions.connectors;
        this.networkOptions = _filterOptions.networks;
        this.costOptions = _filterOptions.costs;

        // Set all filter options as active
        _filterOptions.connectors.forEach((option) => this.selectedOptions.push(option))
        _filterOptions.networks.forEach((option) => this.selectedOptions.push(option))
        _filterOptions.costs.forEach((option) => this.selectedOptions.push(option))
        console.log(this.selectedOptions);

      }
    })

  }

  private optionsMap(options: string[][]) {
    console.log(options);
    //connector


    // if (options[2]) {
    //   let connectors = options[2].forEach((option) => {
    //     let connectorObj:DropDownFilterList = {
    //       value: option.toLowerCase(),
    //       checked : true,
    //       viewName: option,
    //     }
    //     this.connectorOptions.push(connectorObj)
    //     this.checkedList.push(option); // to load options as selected on init
    //   })}
    //network


    // if (options[1]) {
    //   let networks = options[1].forEach((option) => {
    //     let networkObj:DropDownFilterList = {
    //       value: option.toLowerCase(),
    //       checked : true,
    //       viewName: option,
    //     }
    //     this.networkOptions.push(networkObj)
    //     this.checkedList.push(option); // to load options as selected on init
    //   })
    // }

  }


//   getSelectedValue(status:Boolean,value:any){
//     if(status){
//       console.log(value);
//       console.log(typeof value);
//       if (!this.checkedList.includes(value)) {
//         this.checkedList.push(value);
//       }

//       if (this.checkedList.includes(value)) {
//         let index = this.checkedList.indexOf(value);
//         this.checkedList.splice(index,1);

//       }




//       // this.checkedList.push(value);
//     }
//     // else{
//     //     var index = this.checkedList.indexOf(value);

//     // }
//     // console.log(this.currentSelected);
//     console.log(this.checkedList);
//     // TODO populate this.checkedlist with all connectors, networks + "charge" and "free"
//     this.currentSelected = {checked : status,name:value};

//     //share checked list
//     this.shareCheckedlist();

//     //share individual selected item
//     this.shareIndividualStatus();
// }
// shareCheckedlist(){
//      this.shareCheckedList.emit(this.checkedList);
// }
// shareIndividualStatus(){
//     this.shareIndividualCheckedList.emit(this.currentSelected);
// }


 filterToggle() {
  console.log('filter toggle clicked');

 }

 onFilterButtonClick(option) {

  if (this.selectedOptions.includes(option)) {
    const newOptions = this.selectedOptions.filter(item => item !== option)
    this.selectedOptions = newOptions;
    // TODO - activate class for flat button

  } else {
    this.selectedOptions.push(option)
    // TODO - activate class for sunk button
  }
  console.log(this.selectedOptions);

  this.store.dispatch(new UpdateSelectedFilterOptions(this.selectedOptions))
 }

 setBurgerClass(event:any) {
  const nodeList = Array(event.target.childNodes)[0];

  nodeList.forEach((nodeItem:any) => {
    const clss:string = nodeItem.className;
    const lastChar: string | number = clss[clss.length-1];
    let burgerIndex:number = Number(clss[5]) - 1;

    if (lastChar !== 'x') {
      this.burgerClasses[burgerIndex] = this.burgerClasses[burgerIndex] + "-x";
      }
      else {
        this.burgerClasses[burgerIndex] = this.burgerClasses[burgerIndex].substring(0,6);
      }
    })
  }
}
