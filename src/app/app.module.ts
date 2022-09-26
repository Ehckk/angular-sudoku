import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { ViewboardComponent } from './viewboard/viewboard.component';
import { PlayboardComponent } from './playboard/playboard.component';
import { ViewsquareComponent } from './viewsquare/viewsquare.component';
import { PlaysquareComponent } from './playsquare/playsquare.component';
import { CandidateComponent } from './candidate/candidate.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewboardComponent,
    PlayboardComponent,
    ViewsquareComponent,
    PlaysquareComponent,
    CandidateComponent,
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
