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
import { HomeComponent } from './components/home/home.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask, IConfig } from 'ngx-mask';
import { GerenciarBoloesComponent } from './components/gerenciar/gerenciar-boloes/gerenciar-boloes.component';
import { GerenciarTimesComponent } from './components/gerenciar/gerenciar-times/gerenciar-times.component';
import { RealizarPalpiteComponent } from './components/palpite/realizar-palpite/realizar-palpite.component';
import { RelatorioCuponsComponent } from './components/palpite/relatorio-cupons/relatorio-cupons.component';
import { RelatorioAcumuladoComponent } from './components/palpite/relatorio-acumulado/relatorio-acumulado.component';
import { CriarBoloesComponent } from './components/gerenciar/criar-boloes/criar-boloes.component';
import { ExcluirBoloesComponent } from './components/gerenciar/excluir-boloes/excluir-boloes.component';
import { PublicarBolaoComponent } from './components/gerenciar/publicar-bolao/publicar-bolao.component';


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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
