import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component'
import { BoardComponent } from './board/board.component'
import { OptionsComponent } from './options/options.component'

@NgModule({
  declarations: [AppComponent, BoardComponent, OptionsComponent],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
