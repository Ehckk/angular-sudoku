import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { ViewboardComponent } from './viewboard/viewboard.component';
import { PlayboardComponent } from './playboard/playboard.component';
import { ViewsquareComponent } from './viewsquare/viewsquare.component';
import { PlaysquareComponent } from './playsquare/playsquare.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ViewboardComponent,
    PlayboardComponent,
    ViewsquareComponent,
    PlaysquareComponent,
  ],
  imports: [
    SharedModule.forRoot(),
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
