import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss']
})
export class FilterButtonComponent implements OnInit {
  @Input() filterName = '';
  isFilterOn:boolean = true;

  constructor() {}

  ngOnInit(): void {}

  toggleClass() {
    this.isFilterOn = !this.isFilterOn;
  }

}
