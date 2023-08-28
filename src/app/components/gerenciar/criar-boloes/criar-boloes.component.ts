import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-criar-boloes',
  templateUrl: './criar-boloes.component.html',
  styleUrls: ['./criar-boloes.component.scss']
})
export class CriarBoloesComponent {

  campeonatos:any []= [];
  times:any []= [];

  prePartida:any [] = []

  dataHora:any;
  tHome:any;
  tAway:any;
  oLogoHome:string = 'https://images.vexels.com/media/users/3/134388/isolated/preview/ed01ac040492025efe782a22d6d56bf6-etiqueta-de-escudo-cinza.png';
  oLogoAway:string = 'https://images.vexels.com/media/users/3/134388/isolated/preview/ed01ac040492025efe782a22d6d56bf6-etiqueta-de-escudo-cinza.png';

  oDataInicio:any;
  oDataFim:any;

  constructor(private api: ApiService){ 
   
  }

  ngOnInit(){
    this.api.getCampeonatos().subscribe(res => {
      this.campeonatos = res;
      console.log("CAmpeonatos:",this.campeonatos)
    })

    this.api.getTimes().subscribe(res => {
      this.times = res;
      console.log("Times:",this.times)
    })

  }

  atualizarImagem(timeId:any, T:string){

    if(T == 'HOME'){
      const oTeamHome = this.times.find(time => time.id == timeId);
      this.oLogoHome = oTeamHome.logo;
     
   
    }else{
      const oTeamAway = this.times.find(time => time.id == timeId);
      this.oLogoAway = oTeamAway.logo;
    }

  }

  adicionarPartida(tHomeId:number,tAwayId:number, dataHora:any) {
    console.log(tHomeId)
    const oTeamHome = this.times.find(time => time.id == tHomeId);
    const oTeamAway = this.times.find(time => time.id == tAwayId);

   
   console.log(oTeamHome)

   this.prePartida.push({
    oTeamHome: oTeamHome,
    oTeamAway: oTeamAway,
    dataHora: dataHora
  });

  this.encontrarEventosExtremos();
    
  this.dataHora = '';
  this.tHome = '';
  this.tAway = '';
  this.oLogoAway = 'https://images.vexels.com/media/users/3/134388/isolated/preview/ed01ac040492025efe782a22d6d56bf6-etiqueta-de-escudo-cinza.png';
  this.oLogoHome = 'https://images.vexels.com/media/users/3/134388/isolated/preview/ed01ac040492025efe782a22d6d56bf6-etiqueta-de-escudo-cinza.png';

  }

  encontrarEventosExtremos() {
    if (this.prePartida.length === 0) {
      console.log('Nenhum evento encontrado');
      return;
    }
  
    let primeiroEvento = this.prePartida[0];
    let ultimoEvento = this.prePartida[0];
  
    for (const partida of this.prePartida) {
      if (partida.dataHora < primeiroEvento.dataHora) {
        primeiroEvento = partida;
      }
  
      if (partida.dataHora > ultimoEvento.dataHora) {
        ultimoEvento = partida;
      }
    }
    
    this.oDataInicio = primeiroEvento.dataHora;
    this.oDataFim    = ultimoEvento.dataHora;
    console.log('Evento que começa primeiro:', primeiroEvento);
    console.log('Evento que termina por último:', ultimoEvento);
  }

  removePartida(index: number) {
    this.prePartida.splice(index, 1);
  }
  

}
