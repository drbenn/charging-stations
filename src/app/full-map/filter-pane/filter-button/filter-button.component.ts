import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss']
})
export class FilterButtonComponent implements OnInit {
  @Input() filterName = '';
  @Input() active = '';
  class:string = 'button';
  constructor() { }

  ngOnInit(): void {
    console.log(this.filterName);
    console.log(this.active);


  }

  toggleClass() {
    this.class === 'button' ? this.class = 'button-inactive' : this.class = 'button'
  }

}
