import { Component, OnInit } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { ApiService } from './shared/services/api.service';
import { DataService } from './shared/services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'charging-stations';
  apiData: any;
  apiData$: any;

  constructor(private apiService: ApiService, private dataService:DataService) {}

  ngOnInit(): any {
    this.dataService.initData();
    // console.log(jsonData);


    // this.apiData$ = this.apiService.callApi()
    //       .pipe(tap((data) => {
    //    console.table(data);
    //     this.apiData = data
    //   }));

    // works in html json pipe only
    // pipe(take(1)) will take only once and then close subscription instead of leaving subscription open w/ memory leak.
    // BUT, this only hits the html and is not available in component
    // this.apiService.callApi().pipe(take(1)).subscribe((data)=> {
    //   this.apiData = data;
    // });
  }
}
