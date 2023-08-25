import { Component, ElementRef, Input, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Bolao } from '../realizar-palpite/realizar-palpite.component';

@Component({
  selector: 'app-relatorio-acumulado',
  templateUrl: './relatorio-acumulado.component.html',
  styleUrls: ['./relatorio-acumulado.component.scss']
})
export class RelatorioAcumuladoComponent {

  
  @Input()
  BolaoItem!: Bolao;

  porcentagemRecuperacao: number = 0;
 
  ngOnInit() {
    if (this.BolaoItem !== null && this.BolaoItem !== undefined) {
      this.calculatePorcentagemRecuperacao();
    }
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['BolaoItem']) {
      this.calculatePorcentagemRecuperacao();
    }
  }
  
  private calculatePorcentagemRecuperacao() {
    const acumulado = this.BolaoItem?.acumuladoBase || 0;
    const recuperado = this.BolaoItem?.recuperado || 0;
  
    if (acumulado > 0) {
      this.porcentagemRecuperacao = (recuperado / acumulado) * 100;
    } else {
      this.porcentagemRecuperacao = 0;
    
}
  }

}
