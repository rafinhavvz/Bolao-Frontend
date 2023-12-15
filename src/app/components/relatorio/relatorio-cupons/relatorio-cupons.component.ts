import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Bolao } from '../../pagina/realizar-palpite/realizar-palpite.component';
declare var window: any;

export interface cupom{
  cupom: string,
  valor: number,
  status: string,
  data: Date,
  arrayPartida:partida[]

}
export interface partida{
  idBolao: number,
  idTeamHome: number,
  idTeamAway: number,
  data: Date,
  resultadoApost: string,
  resultadoReal: number,
  status: string,
  nomeTimeHome: string,
  nomeTimeAway: string,
  logoTimeHome: string,
  logoTimeAway: string
}

@Component({
  selector: 'app-relatorio-cupons',
  templateUrl: './relatorio-cupons.component.html',
  styleUrls: ['./relatorio-cupons.component.scss']
})
export class RelatorioCuponsComponent {

  
  @ViewChild('myModal') myModal!: ElementRef;

  @Input()
  BolaoItem!: Bolao;

  apostas: any[] = [];
  formModal: any;
  cupomAposta:any [] = [];

  cupom!: cupom; 

    constructor(private api: ApiService){
      
    }

    ngOnInit() {
      if (this.BolaoItem !== null && this.BolaoItem !== undefined) {
        this.carregarAposta();
      }
      
      this.formModal = new window.bootstrap.Modal(
        document.getElementById('myModal')
      );
    }

    ngOnChanges(changes: SimpleChanges){
      if (changes['BolaoItem']) {
        this.ngOnInit();
        this.carregarAposta();
      }
    }

  
    openPopup(aposta:any) {
      console.log("RESPOSta",aposta.id)
      this.api.getPartidasApostaId(aposta.id).subscribe(res =>{
        

        this.cupom = {
          cupom: aposta.cupons,
          valor: aposta.valorApostado,
          status: aposta.status,
          data: aposta.data,
          arrayPartida: res
        };
        console.log(this.cupom)
        this.formModal.show();
      })
      
    }
    closeModel() {
      this.formModal.hide();
    }


    private carregarAposta(){
      const idBolao = this.BolaoItem.id; // Captura o valor de this.IdBolao
      if(idBolao != null){
        
        this.api.getApostas().subscribe({
          next: (res: any) => {
            
            const resultadosFiltrados = res.filter((item: { idBolao: any; }) => item.idBolao === idBolao);
            this.apostas = resultadosFiltrados;
          },
          error: (error: any) => {
            console.error('Erro ao carregar as apostas:', error);
          },
        });
      }
    }

}
