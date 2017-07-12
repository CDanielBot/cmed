import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';

import {FunkyNodesComponent} from './funky-nodes/funky-nodes.component';

@NgModule({
  declarations: [
    FunkyNodesComponent
  ],
  imports: [
    BrowserModule, FormsModule
  ],
  providers: [],
  bootstrap: [FunkyNodesComponent]
})
export class AppModule {
}
