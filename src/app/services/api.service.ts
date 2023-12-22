import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = "http://192.168.1.106:80/bolaoApi"
  constructor(private http: HttpClient) { }


  getBaseUrl(): string {
    return this.baseUrl;
  }
  getBoloes() {
    return this.http.get<any>(this.baseUrl + "/Boloes").pipe(
      catchError(this.handleError)
    );
  }

  getCampeonatos() {
    return this.http.get<any>(this.baseUrl + "/Campeonatos").pipe(
      catchError(this.handleError)
    );
  }

  getTimes() {
    return this.http.get<any>(this.baseUrl + "/Times").pipe(
      catchError(this.handleError)
    );
  }

  getApostas() {
    return this.http.get<any>(this.baseUrl + "/Apostas").pipe(
      catchError(this.handleError)
    );
  }

  getTramitacaoRodada(idBolao: any) {
    return this.http.get<any>(this.baseUrl + "/TramitacaoRodada/IdBolaoList?oItemId="+ idBolao).pipe(
      catchError(this.handleError)
    );
  }

  postApostas(aposta: any) {
    console.log("PASSOU",aposta)
    return this.http.post<any>(this.baseUrl + "/Apostas", aposta).pipe(
      catchError(this.handleError)
    );
  }

  postImagem(imagem: any) {
    return this.http.post<any>(this.baseUrl + "/Boloes/Image", imagem).pipe(
      catchError(this.handleError)
    );
  }

  postBolao(bolao: any) {
    return this.http.post<any>(this.baseUrl + "/Boloes", bolao).pipe(
      catchError(this.handleError)
    );
  }

  postPartidas(partidas: any) {
    return this.http.post<any>(this.baseUrl + "/Partidas", partidas).pipe(
      catchError(this.handleError)
    );
  }

  updatePartidas(partidas: any) {
    return this.http.put<any>(this.baseUrl + "/Partidas/update", partidas).pipe(
      catchError(this.handleError)
    );
  }
  
  postApostasPartidas(partidas: any) {
    return this.http.post<any>(this.baseUrl + "/ApostasPartidas", partidas).pipe(
      catchError(this.handleError)
    );
  }

  getBoloesId(id:number){
    return this.http.get<any>(this.baseUrl + "/Boloes/Id?oItemId="+ id).pipe(
      catchError(this.handleError)
    );
  }

  getPartidasId(id:number){
    return this.http.get<any>(this.baseUrl + "/Partidas/Id?oItemId="+ id).pipe(
      catchError(this.handleError)
    );
  }

  getPartidasApostaId(id:number){
    return this.http.get<any>(this.baseUrl + "/ApostasPartidas/Id?oItemId="+ id).pipe(
      catchError(this.handleError)
    );
  }

  getApostaIdBolao(idBolao:number){
    return this.http.get<any>(this.baseUrl + "/Apostas/IdBolao?oItemId="+ idBolao).pipe(
      catchError(this.handleError)
    );
  }

  getTimesId(id:number){
    return this.http.get<any>(this.baseUrl + "/Times/Id?oItemId="+ id).pipe(
      catchError(this.handleError)
    );
  }

  updateBoloes(bolao: any, acumulado: number) {
    const url = `${this.baseUrl}/Boloes/Update?acumulado=${acumulado}`;

    return this.http.put<any>(url, bolao);
  }

  updateApostaCupom(Cupons: any) {
    return this.http.put<any>(this.baseUrl + "/Apostas/Update", Cupons).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do cliente
      console.error('Um erro ocorreu:', error.error.message);
    } else {
      // O backend retornou um código de erro
      console.error(
        `Backend retornou o código ${error.status}, ` +
        `mensagem: ${error.error}` +
        `mensagem de erro: ${JSON.stringify(error)}`);
    }
    // Retorna um observable com uma mensagem de erro para o componente que chamou a função    
    return throwError('Algo deu errado; por favor, tente novamente mais tarde.');
  }

}