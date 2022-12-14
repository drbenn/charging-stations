import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FullMapComponent } from './full-map/full-map.component';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AppState } from './shared/state/appState.state';
import { NavComponent } from './nav/nav.component';
import { FilterPaneComponent } from './full-map/filter-pane/filter-pane.component';
import { IntroComponent } from './intro/intro.component';
import { IntersectionObserverModule } from '@ng-web-apis/intersection-observer';
import { FilterButtonComponent } from './full-map/filter-pane/filter-button/filter-button.component';



@NgModule({
  declarations: [
    AppComponent,
    FullMapComponent,
    NavComponent,
    FilterPaneComponent,
    IntroComponent,
    FilterButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    IntersectionObserverModule,
    NgxsModule.forRoot([AppState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
