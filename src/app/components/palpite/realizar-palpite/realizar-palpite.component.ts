import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError, forkJoin, of, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { CurrencyPipe } from '@angular/common';

export interface Bolao {
  acumulado: number;
  acumuladoBase: number;
  dataFim: string;
  dataInicio: string;
  id: number;
  idTipo: number;
  logo: string;
  name: string;
  premio: number;
  recuperado: number;
  round: number;
  valor: number;
}

@Component({
  selector: 'app-realizar-palpite',
  templateUrl: './realizar-palpite.component.html',
  styleUrls: ['./realizar-palpite.component.scss']
})
export class RealizarPalpiteComponent {

  id: number = 0;
  abaAtiva = 'home';
  botaoAtivoIndex: number[] = [];
  formattedValue: string = '';

  apostaFinal = {
    valorBase: 10.53,
    valorTotal: 10.53,
    qtdCupom: 1,
    premioExtra: 0,
    acumulado: 0,
    acumuladoBase: 0,
  };

  bolao: Bolao = {
    acumulado: 0,
    acumuladoBase: 0,
    dataFim: '',
    dataInicio: '',
    id: 0,
    idTipo: 0,
    logo: '',
    name: '',
    premio: 0,
    recuperado: 0,
    round: 0,
    valor: 0,
  };
  partida: any[] = [];
  timeSelecionado: any[] = [];
  private subscription: Subscription | undefined = undefined;

  constructor(private api: ApiService, private route: ActivatedRoute) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.timeSelecionado = [];
    // Desmarca todos os botões, definindo todos os índices como -1
    this.botaoAtivoIndex.fill(-1);
    this.id = this.route.snapshot.params['id'];
    this.api.getBoloesId(this.id).subscribe({
      next: (res: any) => {
        this.bolao = res;

        const premioNovo = res.premio + res.valor * 0.5;

        let acumuladoBase = 0;
        let acumuladoNovo = 0;
        if (res.recuperado == res.acumuladoBase) {
          acumuladoBase = res.acumulado;
          acumuladoNovo = res.acumulado + res.valor * 0.2;
        } else {
          acumuladoBase = res.recuperado;
          acumuladoNovo = res.recuperado + res.valor * 0.2;
        }
        console.log(acumuladoNovo);
        this.apostaFinal = {
          valorBase: res.valor,
          valorTotal: res.valor,
          qtdCupom: 1,
          acumuladoBase: acumuladoBase,
          acumulado: acumuladoNovo,
          premioExtra: premioNovo,
        };
      },
      error: (error: any) => {
        console.error('Erro ao carregar os bolões:', error);
      },
    });

    this.subscription = this.api.getPartidasId(this.id).subscribe({
      next: (res: any) => {
        this.partida = res;
      },
      error: (error: any) => {
        console.error('Erro ao carregar os bolões:', error);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  apostaTeam(selecionado: string, index: number, opcao: number) {
    if (this.botaoAtivoIndex[index] === opcao) {
      // Clicou no botão ativo novamente, desativa ele
      this.botaoAtivoIndex[index] = -1;
    } else {
      // Clicou em um novo botão, atualiza o índice ativo
      this.botaoAtivoIndex[index] = opcao;
    }

    const firstTab = document.getElementById('home-tab');
    if (firstTab) {
      firstTab.click();
    }

    const partidaSelecionada = this.partida[index];

    // Verifica se já existe um objeto com o mesmo idPartida no array timeSelecionado
    const existingIndex = this.timeSelecionado.findIndex(
      (item) => item.idPartida === partidaSelecionada.id
    );

    if (existingIndex !== -1) {
      // Se o resultado for diferente, atualize-o
      if (this.timeSelecionado[existingIndex].resultado !== selecionado) {
        this.timeSelecionado[existingIndex].resultado = selecionado;
      } else {
        // Se o resultado for o mesmo, remova o objeto do array
        this.timeSelecionado.splice(existingIndex, 1);
      }
    } else {
      // Adiciona um novo objeto ao array timeSelecionado
      this.timeSelecionado.push({
        resultado: selecionado,
        idPartida: partidaSelecionada.id,
        home: partidaSelecionada.timeHomeName,
        fora: partidaSelecionada.timeAwayName,
      });
    }
  }
  retirarTime(time: any, index: number) {
    this.timeSelecionado = this.timeSelecionado.filter((item) => item !== time);
    // Verifica se o botão excluído estava ativo e, se sim, desmarca-o
    if (this.botaoAtivoIndex[index] !== -1) {
      this.botaoAtivoIndex[index] = -1;
    }
  }

  incrementarValor() {
    console.log('Valor antes:', this.apostaFinal.valorTotal);
    this.apostaFinal.qtdCupom++;
    // Calcula o valor do cupom multiplicado pela quantidade de cupons
    const valorCupomMultiplicado =
      this.apostaFinal.valorBase * this.apostaFinal.qtdCupom;

    // Atualiza o valor total apenas com o valor do cupom multiplicado
    this.apostaFinal.valorTotal = valorCupomMultiplicado;

    // Calcula o prêmio novo com o valor do cupom multiplicado e adiciona 50%
    const premioNovo = this.bolao.premio + valorCupomMultiplicado * 0.5;
    const acumuladoNovo =
      this.apostaFinal.acumuladoBase + valorCupomMultiplicado * 0.2;
    this.apostaFinal.acumulado = acumuladoNovo;

    // Atualiza o prêmio extra com o prêmio novo calculado
    this.apostaFinal.premioExtra = premioNovo;
  }

  decrementarValor() {
    if (this.apostaFinal.qtdCupom > 1) {
      this.apostaFinal.qtdCupom--;

      // Calcula o valor do cupom multiplicado pela quantidade de cupons após decremento
      const valorCupomMultiplicado =
        this.apostaFinal.valorBase * this.apostaFinal.qtdCupom;

      // Atualiza o valor total apenas com o valor do cupom multiplicado após decremento
      this.apostaFinal.valorTotal = valorCupomMultiplicado;

      // Calcula o prêmio novo com o valor do cupom multiplicado e adiciona 50%
      const premioNovo = this.bolao.premio + valorCupomMultiplicado * 0.5;
      const acumuladoNovo =
        this.apostaFinal.acumuladoBase + valorCupomMultiplicado * 0.2;
      this.apostaFinal.acumulado = acumuladoNovo;

      // Atualiza o prêmio extra com o prêmio novo calculado
      this.apostaFinal.premioExtra = premioNovo;
    }
  }
  digiteValor() {
    // Calcula o valor do cupom multiplicado pela quantidade de cupons após a digitação
    const valorCupomMultiplicado =
      this.apostaFinal.valorBase * this.apostaFinal.qtdCupom;

    // Atualiza o valor total apenas com o valor do cupom multiplicado
    this.apostaFinal.valorTotal = valorCupomMultiplicado;

    // Calcula o prêmio novo com o valor do cupom multiplicado e adiciona 50%
    const premioNovo = this.bolao.premio + valorCupomMultiplicado * 0.5;
    const acumuladoNovo =
      this.apostaFinal.acumuladoBase + valorCupomMultiplicado * 0.2;
    this.apostaFinal.acumulado = acumuladoNovo;
    console.log('t', acumuladoNovo);
    // Atualiza o prêmio extra com o prêmio novo calculado
    this.apostaFinal.premioExtra = premioNovo;

    console.log('Valor após digitação:', this.apostaFinal.valorTotal);
    console.log('Prêmio extra após digitação:', this.apostaFinal.premioExtra);
  }

  limparTimes() {
    this.timeSelecionado = [];
    // Desmarca todos os botões, definindo todos os índices como -1
    this.botaoAtivoIndex.fill(-1);
  }

  finalizarBet(partidas: any, aposta: any) {
    if (aposta.qtdCupom == 1) {
      let acumuladoBase = 0;
      if (this.bolao.recuperado == this.bolao.acumulado) {
        aposta.acumulado = aposta.acumuladoBase + aposta.valor * 0.2;
      }
    }
    const bolao = {
      id: this.bolao.id,
      premio: aposta.premioExtra,
      acumulado: this.bolao.acumulado,
      acumuladoBase: this.bolao.acumuladoBase,
      dataFim: this.bolao.dataFim,
      dataInicio: this.bolao.dataInicio,
      idTipo: this.bolao.idTipo,
      logo: this.bolao.logo,
      name: this.bolao.name,
      recuperado: this.bolao.recuperado,
      round: this.bolao.round,
      valor: this.bolao.valor,
    };
    const acumulado = aposta.acumulado;

    const myAposta = {
    id: 0,
    idBolao: this.bolao.id,
    idCliente: 2,
    round: this.bolao.round,
    data: new Date(),
    cupons: this.geradorCodigo(),
    status: "EM ANDAMENTO",
    qtdCupom: aposta.qtdCupom,
    valorApostado: aposta.valorTotal,
    valorGanho: 0
    }
   
    
    //Faz as chamadas de serviço em paralelo usando forkJoin
    forkJoin([
      
      this.api.updateBoloes(bolao, acumulado),
      this.api.postApostas(myAposta),
    ])
      .pipe(
        tap(([updateBoloesRes, postApostasRes]) => {
          // Trate os resultados, se necessário
          console.log('Resultado de updateBoloes:', updateBoloesRes);
          console.log('Resultado de postApostas:', postApostasRes);

          const novasPartidas = [];

          // Loop através das partidas originais
          for (let i = 0; i < partidas.length; i++) {
              // Criar um objeto novo com as propriedades da partida original e idAposta modificada
              const novaPartida = {
                  id: 0,
                  idAposta: postApostasRes?.idAposta,
                  idPartida: partidas[i].idPartida,
                  status: "EM ANDAMENTO",
                  resultado: partidas[i].resultado === partidas[i].home ? 1 : partidas[i].resultado === "Empate" ? 2 : partidas[i].resultado === partidas[i].fora ? 3 : partidas[i].resultado
              };
              
              // Adicionar a nova partida ao novo array
              novasPartidas.push(novaPartida);
          }

          this.api.postApostasPartidas(novasPartidas).subscribe(res =>{
            console.log("resposta:",res)
          })

        }),
        catchError((error: any) => {
          // Trate os erros de ambas as requisições aqui
          console.error('Erro:', error);
          // Opcional: relançar o erro para que ele seja tratado pelo componente que chama o método
          throw error;
        })
      )
      .subscribe();

   this.ngOnInit();
  }

  geradorLetras(): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
  }
  geradorNumero(): number {
    return Math.floor(Math.random() * 90) + 10;
  }

  geradorCodigo(): string {
    let code = '';
    
    for (let i = 0; i < 3; i++) {
      code += this.geradorLetras();
    }
    
    for (let i = 0; i < 1; i++) {
      code += this.geradorNumero().toString();
      console.log(code)
    }
    
    return code;
  }

}
