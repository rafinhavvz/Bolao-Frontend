import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss'],
  animations: [
    trigger('expandeContrai', [
      state('true', style({   height: '300px',display:'block'})),
      state('false', style({ height: '0',display:'none'})),
      transition('false <=> true', animate('0.3s')),
    ]),
    trigger('fadeInOut', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [
        style({ height: '*' }),
        animate(250, style({ height: 0 }))
      ]),
      transition('void => *', [
        style({ height: '0' }),
        animate(250, style({ height: '*' }))
      ])
    ]),
    trigger('fadeInOutWithOpacity', [
      state('*', style({ opacity: 1 })),
      state('void', style({ opacity: 0 })),
      transition('* => void', [
        style({ opacity: 1 }),
        animate(500, style({ opacity: 0 }))
      ]),
      transition('void => *', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ])
    ]),
  ],
})
export class ResultadoComponent {

  linhaAtiva: number | null = null;
  mostrarBarra: boolean = false;
  mostraCupom: boolean = false;
  indexMostrarBarra:any = null;
  private subscription: Subscription | undefined = undefined;

  boloes:any[] = [];
  boloesDuplicado:any[] = [];
  partida:any[] = [];
  apostas:any[] = [];
  bolaoselecionado:any = {};
  cupomSelecionado:any = {};
  constructor(private api: ApiService) {
    this.subscription = new Subscription();
  }

  ngOnInit(){
    this.subscription = this.api.getBoloes().subscribe({
      next: (boloes: any) => {
        this.boloes = boloes;
        console.log(this.boloes);
    
        const partidasObservables = this.boloes.map(bolao => {
          return this.api.getPartidasId(bolao.id);
        });
    
        this.subscription = forkJoin(partidasObservables).subscribe({
          next: (partidas: any[]) => {
            this.boloes.forEach((bolao, index) => {
              bolao.partidas = partidas[index];
            });

            this.boloesDuplicado = this.boloes;
    
            console.log('Bolões com partidas:', this.boloes);
          },
          error: (error: any) => {
            console.error('Erro ao carregar partidas:', error);
          },
        });
      },
      error: (error: any) => {
        console.error('Erro ao carregar os bolões:', error);
      },
    });
  }

  toggleBarra(idBolao:number) {   
    // Encontrar o índice do bolão selecionado
    this.mostraCupom = false;
    this.linhaAtiva = null;

    // Se clicar no mesmo bolão, desative a barra
  if (this.indexMostrarBarra === idBolao) {
    this.mostrarBarra = false;
    this.indexMostrarBarra = null;
  } else {
    // Se clicar em um bolão diferente, ative a barra para esse bolão
    this.mostrarBarra = true;
    this.indexMostrarBarra = idBolao;
  }

  // console.log("bolaoduplicado",idBolao)
  //   this.indexMostrarBarra = idBolao; 
  //   this.mostrarBarra = !this.mostrarBarra;
    this.bolaoselecionado = this.boloes.find(bolao => bolao.id == idBolao);


    if(this.mostrarBarra ){
      
      console.log("IDBolao:",idBolao)
      this.api.getApostas().subscribe({
        next: (res: any) => {
          
          console.log("Apostas:",res)
          
          const resultadosFiltrados = res.filter((item: { idBolao: any; }) => item.idBolao === idBolao);
          this.apostas = resultadosFiltrados;
        },
        error: (error: any) => {
          console.error('Erro ao carregar as apostas:', error);
        },
      });
      
    }
  }

  contarGanhadores(){
    return  this.apostas.filter(p => p.status === "GANHO").length;
  }

  cupomAposta(aposta:any){

    
    this.mostraCupom = true;
    
  
    this.api.getPartidasApostaId(aposta.id).subscribe(res =>{
        

      this.cupomSelecionado = {
        cupom: aposta.cupons,
        idCliente: aposta.idCliente,
        valor: aposta.valorApostado,
        valorGanho: aposta.valorGanho,
        status: aposta.status,
        data: aposta.data,
        arrayPartida: res
      };
     
    });
  }


  palpiteCupom(idPartida:any){
    
    if(this.cupomSelecionado && this.cupomSelecionado.arrayPartida){
      const partida = this.cupomSelecionado.arrayPartida.find((p: { idPartida: any; }) => p.idPartida === idPartida);

      if (partida) {
          // Verificação do status para determinar as classes
      const classes = {
        'palpite-ganho': partida.status === 'GANHO',
        'palpite-perdido': partida.status !== 'GANHO',
      };
  
      return {
        resultadoApost: partida.resultadoApost,
        classes: classes
      };
      } else {
        return null;
      }
    }else{
      return null;
    }
  
}
}
