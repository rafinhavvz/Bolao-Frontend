import { NgModule, DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/pagina/home/home.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask, IConfig } from 'ngx-mask';
import { GerenciarBoloesComponent } from './components/gerenciar/gerenciar-boloes/gerenciar-boloes.component';
import { GerenciarTimesComponent } from './components/gerenciar/gerenciar-times/gerenciar-times.component';
import { RealizarPalpiteComponent } from './components/pagina/realizar-palpite/realizar-palpite.component';
import { RelatorioCuponsComponent } from './components/relatorio/relatorio-cupons/relatorio-cupons.component';
import { RelatorioAcumuladoComponent } from './components/relatorio/relatorio-acumulado/relatorio-acumulado.component';
import { CriarBoloesComponent } from './components/gerenciar/criar-boloes/criar-boloes.component';
import { ExcluirBoloesComponent } from './components/gerenciar/excluir-boloes/excluir-boloes.component';
import { PublicarBolaoComponent } from './components/gerenciar/publicar-bolao/publicar-bolao.component';
import { ResultadoComponent } from './components/pagina/resultado/resultado.component';


const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,  
    GerenciarBoloesComponent,
    GerenciarTimesComponent,
    RealizarPalpiteComponent,
    RelatorioCuponsComponent,
    RelatorioAcumuladoComponent,
    CriarBoloesComponent,
    ExcluirBoloesComponent,
    PublicarBolaoComponent,
    ResultadoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],  
  providers: [
    provideNgxMask(maskConfig),
    {provide: LOCALE_ID, useValue: window.navigator.language} 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
