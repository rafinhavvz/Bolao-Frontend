import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GerenciarTimesComponent } from './components/gerenciar/gerenciar-times/gerenciar-times.component';
import { RealizarPalpiteComponent } from './components/palpite/realizar-palpite/realizar-palpite.component';
import { GerenciarBoloesComponent } from './components/gerenciar/gerenciar-boloes/gerenciar-boloes.component';

const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"bolao/:id", component:RealizarPalpiteComponent},
  {path:"gerenciartimes", component:GerenciarTimesComponent},
  {path:"gerenciarboloes", component:GerenciarBoloesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
