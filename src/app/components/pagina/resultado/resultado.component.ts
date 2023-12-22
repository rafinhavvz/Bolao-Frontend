import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Subscription, catchError, forkJoin, interval, tap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss'],
  animations: [
    trigger('expandeContrai', [
      state('true', style({ height: '300px', })),
      state('false', style({ height: '0', display: 'none' })),
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
    trigger('trocaPremioAcumulado', [
      state('mostrarPremio', style({
        opacity: 1,
        height: '*',
      })),
      state('esconderPremio', style({
        opacity: 0,
        height: 0,
      })),
      transition('mostrarPremio <=> esconderPremio', animate('300ms ease-in-out')),
    ]),
  ],
})
export class ResultadoComponent {

  linhaAtiva: number | null = null;
  mostrarBarra: boolean = false;
  mostraCupom: boolean = false;
  mostrarPremio: boolean = true;
  intervaloTroca: any;
  baseUrl = '';

  indexMostrarBarra: any = null;
  botaoAtivoIndex: number[] = [];

  private subscription: Subscription | undefined = undefined;

  boloes: any[] = [];
  timeSelecionado: any[] = [];
  partida: any[] = [];
  apostas: any[] = [];
  apostaFinal = {
    valorBase: 10.53,
    valorTotal: 10.53,
    qtdCupom: 1,
    premioExtra: 0,
    acumulado: 0,
    acumuladoBase: 0,
  };
  bolaoselecionado: any = {};
  cupomSelecionado: any = {};
  constructor(private api: ApiService) {
    this.subscription = new Subscription();
  }

  ngOnInit() {

    this.baseUrl = this.api.getBaseUrl();
    this.intervaloTroca = setInterval(() => {
      this.togglePremioAcumulado();
    }, 5000);

    this.subscription = this.api.getBoloes().subscribe({
      next: (boloes: any) => {
        this.boloes = boloes;

        const partidasObservables = this.boloes.map(bolao => {
          return this.api.getPartidasId(bolao.id);
        });

        this.subscription = forkJoin(partidasObservables).subscribe({
          next: (partidas: any[]) => {
            this.boloes.forEach((bolao, index) => {
              bolao.partidas = partidas[index];
            });
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

  ngOnDestroy() {
    clearInterval(this.intervaloTroca); // Limpar o intervalo quando o componente for destruído
  }

  verificarValorAposta(res:any){
    const premioNovo = res.premio + res.valor * 0.5;
        let acumuladoBase = 0;
        let acumuladoNovo = 0;
        if (res.recuperado == res.acumuladoBase) {
          console.log("acumuladoNovo");
          acumuladoBase = res.acumulado;
          acumuladoNovo = res.acumulado + res.valor * 0.2;
        } else {
          console.log("acumuladoNovo2");
          acumuladoBase = res.recuperado;
          acumuladoNovo = res.recuperado + res.valor * 0.2;
        }
        
        this.apostaFinal = {
          valorBase: res.valor,
          valorTotal: res.valor,
          qtdCupom: 1,
          acumuladoBase: acumuladoBase,
          acumulado: acumuladoNovo,
          premioExtra: premioNovo,
        };
  }

  togglePremioAcumulado() {
    this.mostrarPremio = !this.mostrarPremio;
  }

  atualizarBolao(idBolao: number){
    this.bolaoselecionado = this.boloes.find(bolao => bolao.id == idBolao);
  }

  toggleBarra(idBolao: number) {
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
    console.log(this.bolaoselecionado )
    if(this.bolaoselecionado.status == 'ANDAMENTO'){
      console.log("FINALIZADO")
      this.verificarValorAposta(this.bolaoselecionado);
    }


    if (this.mostrarBarra) {

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

  contarGanhadores() {
    return this.apostas.filter(p => p.status === "GANHO").length;
  }

  cupomAposta(aposta: any) {


    this.mostraCupom = true;


    this.api.getPartidasApostaId(aposta.id).subscribe(res => {


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


  palpiteCupom(idPartida: any) {

    if (this.cupomSelecionado && this.cupomSelecionado.arrayPartida) {
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
    } else {
      return null;
    }

  }

  limparTimes() {
    this.timeSelecionado = [];
    this.apostaFinal.qtdCupom = 1;
    // Desmarca todos os botões, definindo todos os índices como -1
    this.botaoAtivoIndex.fill(-1);
  }


  retirarTime(time: any, index: number) {
    this.timeSelecionado = this.timeSelecionado.filter((item) => item !== time);
    // Verifica se o botão excluído estava ativo e, se sim, desmarca-o
    if (this.botaoAtivoIndex[index] !== -1) {
      this.botaoAtivoIndex[index] = -1;
    }
  }

  apostaTeam(selecionado: string, index: number, opcao: number, idBolao: number) {
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

    const bolao: any = this.boloes.find((b) => b.id == idBolao);
    console.log(bolao.partidas)
    const partidaSelecionada = bolao.partidas[index];
    console.log(bolao.partidas)

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

  incrementarValor() {
    console.log('Valor antes:', this.apostaFinal.valorTotal);
    this.apostaFinal.qtdCupom++;
    // Calcula o valor do cupom multiplicado pela quantidade de cupons
    const valorCupomMultiplicado =
      this.apostaFinal.valorBase * this.apostaFinal.qtdCupom;

    // Atualiza o valor total apenas com o valor do cupom multiplicado
    this.apostaFinal.valorTotal = valorCupomMultiplicado;

    // Calcula o prêmio novo com o valor do cupom multiplicado e adiciona 50%
    const premioNovo = this.bolaoselecionado.premio + valorCupomMultiplicado * 0.5;
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
      const premioNovo = this.bolaoselecionado.premio + valorCupomMultiplicado * 0.5;
      const acumuladoNovo = this.apostaFinal.acumuladoBase + valorCupomMultiplicado * 0.2;
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
    const premioNovo = this.bolaoselecionado.premio + valorCupomMultiplicado * 0.5;
    const acumuladoNovo =
      this.apostaFinal.acumuladoBase + valorCupomMultiplicado * 0.2;
    this.apostaFinal.acumulado = acumuladoNovo;
    console.log('t', acumuladoNovo);
    // Atualiza o prêmio extra com o prêmio novo calculado
    this.apostaFinal.premioExtra = premioNovo;

    console.log('Valor após digitação:', this.apostaFinal.valorTotal);
    console.log('Prêmio extra após digitação:', this.apostaFinal.premioExtra);
  }

  finalizarBet(partidas: any, aposta: any) {
    if (aposta.qtdCupom == 1) {
      let acumuladoBase = 0;
      if (this.bolaoselecionado.recuperado == this.bolaoselecionado.acumulado) {
        aposta.acumulado = aposta.acumuladoBase + aposta.valor * 0.2;
      }
    }
    const bolao = {
      id: this.bolaoselecionado.id,
      premio: aposta.premioExtra,
      acumulado: this.bolaoselecionado.acumulado,
      acumuladoBase: this.bolaoselecionado.acumuladoBase,
      dataFim: this.bolaoselecionado.dataFim,
      dataInicio: this.bolaoselecionado.dataInicio,
      idCampeonato: this.bolaoselecionado.idCampeonato,
      logo: this.bolaoselecionado.logo,
      name: this.bolaoselecionado.name,
      recuperado: this.bolaoselecionado.recuperado,
      round: this.bolaoselecionado.round,
      valor: this.bolaoselecionado.valor,
      status: this.bolaoselecionado.status,
    };
    const acumulado = aposta.acumulado;

    const myAposta = {
    id: 0,
    idBolao: this.bolaoselecionado.id,
    idCliente: 2,
    round: this.bolaoselecionado.round,
    data: new Date(),
    cupons: this.geradorCodigo(),
    status: "EM ANDAMENTO",
    qtdCupom: aposta.qtdCupom,
    valorApostado: aposta.valorTotal,
    valorGanho: 0
    }
   
    console.log("Bolao", bolao, acumulado);

    console.log("myAposta", myAposta);
    
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
            this.limparTimes();
            this.atualizarBolao(bolao.id); 
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
