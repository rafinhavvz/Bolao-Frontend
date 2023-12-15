import { Component, ElementRef, Input, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Bolao } from '../../pagina/realizar-palpite/realizar-palpite.component';
import { ApiService } from 'src/app/services/api.service';


declare var window:any;

@Component({
  selector: 'app-relatorio-acumulado',
  templateUrl: './relatorio-acumulado.component.html',
  styleUrls: ['./relatorio-acumulado.component.scss']
})
export class RelatorioAcumuladoComponent {

  
  @Input()
  BolaoItem!: Bolao;

  @Input()
  modalItem = false;

  porcentagemRecuperacao: number = 0;
  tabelaRodada:any[] = [];
  formModal: any;

  constructor(private api: ApiService,private elementRef: ElementRef) {
  }
 
  ngOnInit() {
    if (this.BolaoItem !== null && this.BolaoItem !== undefined) {
      this.calculatePorcentagemRecuperacao();
    }

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('modalAcumulado')
    );
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['BolaoItem']) {
      this.calculatePorcentagemRecuperacao();

      this.api.getTramitacaoRodada(this.BolaoItem.id).subscribe({
        next:(res:any) => {
          this.tabelaRodada = res;
          console.log(this.tabelaRodada)
        },
        error: (error:any) =>{
          console.error('Erro ao carregar os bolões:', error);
        }
      })
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

  
  openModel(idbolao:number) {
    this.ngOnInit(); 
      this.formModal.show();
    

  
      
  }

}
