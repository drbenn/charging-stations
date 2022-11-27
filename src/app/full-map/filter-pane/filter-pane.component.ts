import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DropDownFilterList } from 'src/app/shared/models/app.models';

@Component({
  selector: 'app-filter-pane',
  templateUrl: './filter-pane.component.html',
  styleUrls: ['./filter-pane.component.scss']
})
export class FilterPaneComponent implements OnInit {
  allObject: DropDownFilterList = {value: 'all',checked : true,viewName: 'All'};
  connectorOptions: DropDownFilterList[] = [this.allObject];
  networkOptions: DropDownFilterList[] = [this.allObject];
  costOptions: DropDownFilterList[] = [
    this.allObject,
    {value: 'charge',checked : true, viewName: 'Charge'},
    {value: 'free',checked : true,viewName: 'Free'}
    ]

  // @Input() list:any[];

  @Output() shareCheckedList = new EventEmitter();
  @Output() shareIndividualCheckedList = new EventEmitter();


  checkedList : any[];
  currentSelected : {};
  showDropDownConnector: boolean = false;
  showDropDownNetwork: boolean = false;
  showDropDownCost: boolean = false;


  constructor(
    private store: Store
  ) {
    this.checkedList = [];
  }

  ngOnInit(): void {
    let dropDownOptions$: Observable<string[][]> = this.store.select(
      (state) => state.appState.dropDownOptions);

    dropDownOptions$.subscribe((_dropDownOptions: string[][]) => {
      if (_dropDownOptions && _dropDownOptions) {
        this.optionsMap(_dropDownOptions);
      }
    })

  }

  private optionsMap(options: string[][]) {
    console.log(options);
    //connector
    if (options[2]) {
      let connectors = options[2].forEach((option) => {
        let connectorObj:DropDownFilterList = {
          value: option.toLowerCase(),
          checked : true,
          viewName: option,
        }
        this.connectorOptions.push(connectorObj)
      })}
    //network
    if (options[1]) {
      let networks = options[1].forEach((option) => {
        let networkObj:DropDownFilterList = {
          value: option.toLowerCase(),
          checked : true,
          viewName: option,
        }
        this.networkOptions.push(networkObj)
      })
    }
  }


  getSelectedValue(status:Boolean,value:String){
    if(status){
      this.checkedList.push(value);
    }else{
        var index = this.checkedList.indexOf(value);
        this.checkedList.splice(index,1);
    }

    this.currentSelected = {checked : status,name:value};

    //share checked list
    this.shareCheckedlist();

    //share individual selected item
    this.shareIndividualStatus();
}
shareCheckedlist(){
     this.shareCheckedList.emit(this.checkedList);
}
shareIndividualStatus(){
    this.shareIndividualCheckedList.emit(this.currentSelected);
}


 filterToggle() {
  console.log('filter toggle clicked');

 }
}
