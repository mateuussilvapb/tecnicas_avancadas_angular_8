import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

import { debounceTime } from "rxjs/operators";

import { GenerosService } from "./../../core/generos.service";
import { ConfigParams } from "./../../shared/models/config-params";
import { FilmesService } from "./../../core/filmes.service";
import { Filme } from "src/app/shared/models/filme";

@Component({
  selector: "dio-listagem-filmes",
  templateUrl: "./listagem-filmes.component.html",
  styleUrls: ["./listagem-filmes.component.scss"],
})
export class ListagemFilmesComponent implements OnInit {
  readonly urlFotoGenerica =
    "https://triunfo.pe.gov.br/pm_tr430/wp-content/uploads/2018/03/sem-foto.jpg";
  generos: Array<string>;
  filmes: Filme[] = [];
  filtrosListagem: FormGroup;
  config: ConfigParams = {
    pagina: 0,
    limite: 8,
  };

  constructor(
    private filmesService: FilmesService,
    private fb: FormBuilder,
    private generosService: GenerosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filtrosListagem = this.fb.group({
      texto: [""],
      genero: [""],
    });

    this.filtrosListagem
      .get("texto")
      .valueChanges.pipe(debounceTime(400))
      .subscribe((val: string) => {
        this.config.pesquisa = val;
        this.resetarConsulta();
      });
    this.filtrosListagem.get("genero").valueChanges.subscribe((val: string) => {
      this.config.campo = { tipo: "genero", valor: val };
      this.resetarConsulta();
    });
    this.generos = this.generosService.generosFilmes();
    this.listarFilmes();
  }

  onScroll(): void {
    // this.ordenarFilmes();
    this.listarFilmes();
  }

  abrir(id: number): void {
    this.router.navigateByUrl(`/filmes/${id}`);
  }

  ordenarFilmes(): void {
    /**
     * Ordena a lista de acordo com um parâmentro específico.
     * Neste caso, o parâmetro título.
     */
    this.filmes.sort((a, b) => (a.titulo < b.titulo ? -1 : 1));
  }

  private listarFilmes(): void {
    this.config.pagina++;
    this.filmesService.listar(this.config).subscribe(
      (filmes: Filme[]) => {
        this.filmes.push(...filmes);
        // this.ordenarFilmes();
      },
      (error) => {
        alert("Erro ao acessar o banco de dados. Tente novamente mais tarde.");
      }
    );
  }

  private resetarConsulta(): void {
    this.config.pagina = 0;
    this.filmes = [];
    this.listarFilmes();
  }
}
