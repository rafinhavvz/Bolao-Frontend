import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pagina/home/home.component';
import { GerenciarTimesComponent } from './components/gerenciar/gerenciar-times/gerenciar-times.component';
import { GerenciarBoloesComponent } from './components/gerenciar/gerenciar-boloes/gerenciar-boloes.component';
import { RealizarPalpiteComponent } from './components/pagina/realizar-palpite/realizar-palpite.component';
import { ResultadoComponent } from './components/pagina/resultado/resultado.component';

const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"bolao/:id", component:RealizarPalpiteComponent},
  {path:"gerenciartimes", component:GerenciarTimesComponent},
  {path:"gerenciarboloes", component:GerenciarBoloesComponent},
  {path:"resultado", component:ResultadoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
