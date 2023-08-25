import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-gerenciar-times',
  templateUrl: './gerenciar-times.component.html',
  styleUrls: ['./gerenciar-times.component.scss']
})
export class GerenciarTimesComponent {
  pesquisaTeam = '';
  teams: any[] = [];

  constructor(private http: HttpClient) {}

  pesquisaTeams() {
    console.log(this.pesquisaTeam)
    if (this.pesquisaTeam.length >= 3) {
      console.log(this.pesquisaTeam)
      const headers = new HttpHeaders({
        'x-rapidapi-key': '8b3c325843140340dc7674fe66fed862'
      });

      const options = { headers: headers };

      const apiUrl = `https://v3.football.api-sports.io/teams?search=${this.pesquisaTeam}`;

      this.http.get(apiUrl, options).subscribe(
        (response: any) => {
          this.teams = response.response;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  salvaEscudo(){
    
  }

}
