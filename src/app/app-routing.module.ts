import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './board/board.component';

const routes: Routes = [
  { path: 'generate', component: BoardComponent },
  { path: 'play', component: BoardComponent },
  {path: '', redirectTo: '/generate', pathMatch: 'full'},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
