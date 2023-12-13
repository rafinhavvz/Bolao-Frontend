import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Bolao } from '../palpite/realizar-palpite/realizar-palpite.component';

declare var window:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy  {
  boloes: any[] = [];
  formModal: any;
  tabelaRodada:any[] = [];
  bolao: Bolao = {
    acumulado: 0,
    acumuladoBase: 0,
    dataFim: '',
    dataInicio: '',
    id: 0,
    idCampeonato: 0,
    logo: '',
    name: '',
    premio: 0,
    recuperado: 0,
    round: 0,
    valor: 0,
    status:''
  };
  modalRelatorio = true;

  private subscription: Subscription | undefined = undefined;

  constructor(private api: ApiService,private elementRef: ElementRef) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.subscription = this.api.getBoloes().subscribe({
      next: (res: any) => {
        this.boloes = res;
        console.log(this.boloes);
      },
      error: (error: any) => {
        console.error('Erro ao carregar os bolões:', error);
      },
    });

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('homeodal')
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


  openModel(idbolao:number) {
    this.api.getTramitacaoRodada(idbolao).subscribe({
      next:(res:any) => {
        this.tabelaRodada = res;
        console.log(this.tabelaRodada)
      },
      error: (error:any) =>{
        console.error('Erro ao carregar os bolões:', error);
      }
    })

    this.bolao = this.boloes.filter(bolao => bolao.id === idbolao)[0];

  this.formModal.show();
      
  }
  
}
