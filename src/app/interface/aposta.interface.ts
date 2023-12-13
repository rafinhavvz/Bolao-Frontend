export interface Aposta {
    cupons: string;
    data: Date;
    id: number;
    idBolao: number;
    idCliente: number;
    qtdCupom: number;
    round: number;
    status: string;
    valorApostado: number;
    valorGanho: number;
    partidas: partida[]
}

export interface partida {
    id:number,
    idPartida:number;
    idBolao: number;
    idTeamHome: number;
    idTeamAway: number;
    data: Date;
    resultadoApost: number;
    resultadoReal: number;
    status: string;
    nomeTimeHome: string;
    nomeTimeAway: string;
    logoTimeHome: string;
    logoTimeAway: string;

}
