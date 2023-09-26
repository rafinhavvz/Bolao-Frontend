import { Component } from '@angular/core';
import { Aposta } from 'src/app/interface/aposta.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-publicar-bolao',
  templateUrl: './publicar-bolao.component.html',
  styleUrls: ['./publicar-bolao.component.scss']
})
export class PublicarBolaoComponent {

  boloes:any []=[];
  partidas:any []=[];
  botaoAtivoIndex: number[] = [];
  selectedBolaoId = 0;
  
  apostas:Aposta [] = [];

  constructor(private api: ApiService,){
    
  }

  ngOnInit(){
    this.botaoAtivoIndex.fill(-1);

    const dataAtual = new Date();
    this.api.getBoloes().subscribe(res =>{
      console.log(res);
      this.boloes = res.filter((bolao: { dataFim  : Date; }) => {
        const dataBolao = new Date(bolao.dataFim); // Supondo que 'data' é a propriedade que contém a data do bolão
        console.log(dataBolao);
        return dataBolao < dataAtual;
      });
    })
  }

  getPartidas(e:any){
    this.api.getPartidasId(e).subscribe(res=>{
      this.partidas = res;
      
    });
    this.api.getApostaIdBolao(e).subscribe(res=>{
      this.apostas = res;
      this.apostas.forEach((aposta) => {
        this.api.getPartidasApostaId(aposta.id).subscribe((partidas) => {
          aposta.partidas = partidas; 
          console.log("Apostas",this.apostas )
        });
      });
    });

    
   
  }

  selecionarTeam(selecionado: number, index: number, opcao: number) {
    if (this.botaoAtivoIndex[index] === opcao) {
      // Clicou no botão ativo novamente, desativa ele
      this.botaoAtivoIndex[index] = -1;
    } else {
      // Clicou em um novo botão, atualiza o índice ativo
      this.botaoAtivoIndex[index] = opcao;
    }
    console.log( this.partidas);
    console.log(selecionado,index)

    if (index >= 0 && index < this.partidas.length) {
      // Verifica se o índice está dentro dos limites válidos do array 'this.partidas'.
      this.partidas[index].resultado = selecionado;
      console.log(this.partidas); // Verifique as partidas atualizadas.
    } else {
      console.error('Índice fora dos limites válidos.');
    }
  }
}
