import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
 
  
  bolaoForm: FormGroup;
  imagemSelecionada: any = "";
  enviarImagem: any = "";

  oDataInicio:any;
  oDataFim:any;

  constructor(private api: ApiService,
              private fb: FormBuilder){ 

                this.bolaoForm = this.fb.group({
                  id: [0],
                  logo: [''],
                  name:[''],
                  round:[1],
                  idCampeonato:[0],
                  valor:[0.001],
                  premio:[0],
                  acumulado:[0],
                  acumuladoBase:[0.001],
                  recuperado:[0],
                  dataInicio:[new Date],
                  dataFim:[new Date],
                  status:['ANDAMENTO']
                });
   
  }

  ngOnInit(){
    this.api.getCampeonatos().subscribe(res => {
      this.campeonatos = res;
    })

    this.api.getTimes().subscribe(res => {
      this.times = res;
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

    this.bolaoForm.patchValue({
      dataInicio: primeiroEvento.dataHora,
      dataFim: ultimoEvento.dataHora
    });

  }

  onBannerSelecionado(e:any): void {
    const file = e.target.files[0];
    console.log(file);

    if (file && file.type.match(/^image\//)) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.imagemSelecionada = e.target?.result;
        this.enviarImagem = file;
        // Atualize a classe .container-img aqui
        // Por exemplo: this.atualizarContainerImg(this.imagemSelecionada);
      };

      reader.readAsDataURL(file);
    } else {
      alert('Por favor, selecione uma imagem válida (PNG ou JPEG).');
    }
  }

  removePartida(index: number) {
    this.prePartida.splice(index, 1);
  }

  enviarBolao() {

    if (this.bolaoForm.valid) {
      const formData = new FormData();
      formData.append('imagem', this.enviarImagem);
      this.api.postImagem(formData).subscribe(res => {

        if (res != null) {
          this.bolaoForm.patchValue({
            logo: res.urlImage
          });

          this.api.postBolao(this.bolaoForm.value).subscribe(res => {
            
            const novoArray = this.prePartida.map((item) => {
              return {
                id: 0,
                idBolao: res.idGerado,
                idTeamHome: item.oTeamHome.id,
                idTeamAway: item.oTeamAway.id,
                data: item.dataHora,
                resultado: 0,
                status: 'EM ANDAMENTO',
              };
            });

            this.api.postPartidas(novoArray).subscribe(res => {
              console.log(res);
            })

          });
        }
      });
    }

  }
  

}
