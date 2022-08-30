import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayboardComponent } from './playboard/playboard.component';
import { ViewboardComponent } from './viewboard/viewboard.component';

const routes: Routes = [
  { path: 'generate', component: ViewboardComponent },
  { path: 'play', component: PlayboardComponent },
  {path: '', redirectTo: '/generate', pathMatch: 'full'},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
