import { Component } from '@angular/core';
import { Aposta } from 'src/app/interface/aposta.interface';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-publicar-bolao',
  templateUrl: './publicar-bolao.component.html',
  styleUrls: ['./publicar-bolao.component.scss']
})
export class PublicarBolaoComponent {

  boloes: any[] = [];
  partidas: any[] = [];
  botaoAtivoIndex: number[] = [];
  selectedBolaoId = 0;
  totalCupons = 0;

  acumulado = 0;
  premio = 0;


  cuponsPremiados = 0;
  totalGanhadores = 0;
  qtdAcertos = 0;
  valorPorCupom = 0;
  premioTotalPago = 0;

  apostas: Aposta[] = [];

  constructor(private api: ApiService,) {

  }

  ngOnInit() {
    this.botaoAtivoIndex.fill(-1);

    const dataAtual = new Date();
    this.api.getBoloes().subscribe(res => {
      this.boloes = res.filter((bolao: { dataFim: Date; }) => {
        const dataBolao = new Date(bolao.dataFim); 
        return dataBolao < dataAtual;
      });
    })
  }

  getPartidas(e: any) {
    this.api.getPartidasId(e).subscribe(res => {
      this.partidas = res;
      console.log("PArtidas",this.partidas);

      this.partidas.forEach((partida, index) => {
        // Substitua 'SEU_VALOR_PADRAO' pelo valor padrão que você deseja usar ao chamar a função selecionarTeam
        const resultado = partida.resultado;
        
        this.selecionarTeam(resultado, index, resultado);
      });

    });
    this.api.getApostaIdBolao(e).subscribe(res => {
      this.apostas = res;
      console.log("APOSTA TESTE",this.apostas)
      this.apostas.forEach((aposta) => {
        this.api.getPartidasApostaId(aposta.id).subscribe((partidas) => {
          aposta.partidas = partidas;
        });
      });
    });
     // Certifique-se de que 'e' contém o ID desejado.
    const bolao = this.boloes.find(bolao => bolao.id == e);
    
    this.acumulado = bolao.acumulado;
    this.premio = bolao.premio;


  }

  totalCupon(aposta:any){
    let totalCupom:any = 0;
    for (var i = 0; i < aposta.length; i++) {
      totalCupom +=  aposta[i].qtdCupom;
    }
    return totalCupom;
  }

  selecionarTeam(selecionado: number, index: number, opcao: number) {
    if (this.botaoAtivoIndex[index] === opcao) {
      // Clicou no botão ativo novamente, desativa ele
      this.botaoAtivoIndex[index] = -1;
    } else {
      // Clicou em um novo botão, atualiza o índice ativo
      this.botaoAtivoIndex[index] = opcao;
    }

    if (index >= 0 && index < this.partidas.length) {
      // Verifica se o índice está dentro dos limites válidos do array 'this.partidas'.
      this.partidas[index].resultado = selecionado;
    } else {
      console.error('Índice fora dos limites válidos.');
    }
  }

  verificarGanhador() {
    this.partidas.forEach(partida => {

      const resultadoPartida = partida.resultado;

      this.apostas.forEach(aposta => {
        aposta.partidas.forEach(partidaAposta => {
          if (partidaAposta.idPartida === partida.id) {
            partidaAposta.resultadoReal = resultadoPartida;
          }
        });
      });
    });
    // Ordenar as apostas com base nos acertos (mais acertos primeiro)
    this.apostas.sort((a, b) => {
      const acertosA = a.partidas.filter(partida => partida.resultadoReal === partida.resultadoApost).length;
      const acertosB = b.partidas.filter(partida => partida.resultadoReal === partida.resultadoApost).length;

      // Ordenar em ordem decrescente (do maior número de acertos para o menor)
      return acertosB - acertosA;
    });
    
    this.calcularValor(this.apostas);
  
  }

  calcularPartidasAcertadas(aposta: Aposta): string {
    if (aposta.partidas && aposta.partidas.length > 0) {
      const numPartidasAcertadas = aposta.partidas.filter(partida => partida.resultadoReal === partida.resultadoApost).length;
      const totalPartidas = aposta.partidas.length;
      return `${numPartidasAcertadas} de ${totalPartidas}`;
    } else {
      return `0 de 0`
    }
  }

  calcularValor(aposta: any): void {
    
    // Suponha que 'acumulado' e 'premio' sejam variáveis que contêm os valores acumulado e prêmio, respectivamente
    let totalGanhadores = 0;
    let totalCupons = 0;
    let maiorQuantidadeAcertos = 0;

    aposta.forEach((aposta: Aposta) => {
      let totalAcertos = 0;
      debugger
      aposta.partidas.forEach(partida => {
        if (partida.resultadoReal === partida.resultadoApost) {
          totalAcertos++;
          partida.status = 'GANHO'; // Definir o status da partida como 'GANHO'
        } else {
          partida.status = 'PERDIDA'; // Definir o status da partida como 'PERDIDA'
        }
      });

      if (totalAcertos > maiorQuantidadeAcertos) {
        maiorQuantidadeAcertos = totalAcertos;
        totalCupons = aposta.qtdCupom;
        totalGanhadores = 1;
      } else if (totalAcertos === maiorQuantidadeAcertos) {
        totalCupons += aposta.qtdCupom;
        totalGanhadores++;
      }

      if (totalAcertos === maiorQuantidadeAcertos || totalAcertos === this.partidas.length) {
        aposta.status = 'GANHO';
      } else {
        aposta.status = 'PERDIDA';
      }
      
    });
    

          let premioTotalPago = 0;

          if (maiorQuantidadeAcertos === this.partidas.length) {
            premioTotalPago = parseFloat((this.acumulado + this.premio).toFixed(2));
          } else if (maiorQuantidadeAcertos > 0) {
            premioTotalPago = parseFloat(this.premio.toFixed(2));
          }

      // Se houver ganhadores, calcule o valor para cada cupom
      if (totalGanhadores > 0) {
        const valorPorCupom = parseFloat((premioTotalPago / totalCupons).toFixed(2));

        aposta.forEach((aposta: { valorGanho: number; status: string; qtdCupom: number; }) => {
          aposta.valorGanho = aposta.status === 'GANHO' ? valorPorCupom * aposta.qtdCupom : 0;
          aposta.valorGanho = parseFloat(aposta.valorGanho.toFixed(2));
          console.log( aposta.valorGanho.toFixed(2))
        });
      }
   

    // Calcule o valor para cada cupom
    //const premioTotalPago = maiorQuantidadeAcertos === this.partidas.length ? this.acumulado + this.premio : this.premio;
    const valorPorCupom = premioTotalPago / totalCupons;
    console.log("APOSTAS", this.apostas);
    // console.log("totalCupons",totalCupons)
    // console.log(`Total de ganhadores: ${totalGanhadores}`);
    // console.log(`Maior quantidade de acertos: ${maiorQuantidadeAcertos}`);
    // console.log(`Prêmio total pago: ${premioTotalPago}`);
    // console.log(`Valor para cada cupom: ${valorPorCupom}`);
    this.cuponsPremiados = totalCupons;
    this.totalGanhadores = totalGanhadores;
    this.qtdAcertos = maiorQuantidadeAcertos;
    this.valorPorCupom = valorPorCupom;
    this.premioTotalPago = premioTotalPago;
  }

  publicarBolao(){
    console.log(this.apostas)
   

    const updatePartida:any = [];

    this.partidas.forEach(partida => {
      // Criar um novo objeto para cada partida
      const partidaAtualizada = {
        id: partida.id,
        idBolao: partida.idBolao,
        idTeamHome: partida.idTeamHome,
        idTeamAway: partida.idTeamAway,
        data: partida.data,
        resultado: partida.resultado,
        status:'FINALIZADO'
        // Adicione as outras propriedades conforme necessário
      };
    
      // Adicionar o objeto atualizado ao array
      updatePartida.push(partidaAtualizada);
    });
    
    console.log(updatePartida);
    this.api.updatePartidas(updatePartida).subscribe({
      next:(res:any) => {
        console.log(res)
        this.verificarGanhador();    
        this.api.updateApostaCupom(this.apostas).subscribe({
            next:(res:any) => {
              console.log(res)
              
            },
            error: (error:any) =>{
              console.error('Erro ao carregar os bolões:', error);
            }
        })
      },
      error: (error:any) =>{
        console.error('Erro ao carregar os bolões:', error);
      }
    });
  }

 
}
