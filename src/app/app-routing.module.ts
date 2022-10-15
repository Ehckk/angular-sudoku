import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerateComponent } from './generate/generate.component';
import { PlayComponent } from './play/play.component';
// import { PlayboardComponent } from './playboard/playboard.component';
// import { ViewboardComponent } from './viewboard/viewboard.component';

const routes: Routes = [
  { path: 'generate', component: GenerateComponent },
  { path: 'play', component: PlayComponent },
  {path: '', redirectTo: '/generate', pathMatch: 'full'},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
