import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { Component, OnInit } from "@angular/core";

import { GenerosService } from "./../../core/generos.service";
import { ValidarCamposService } from "src/app/shared/components/campos/validar-campos.service";
import { Alerta } from "./../../shared/models/alerta";
import { AlertaComponent } from "./../../shared/components/alerta/alerta.component";
import { FilmesService } from "./../../core/filmes.service";
import { Filme } from "./../../shared/models/filme";

@Component({
  selector: "dio-cadastro-filmes",
  templateUrl: "./cadastro-filmes.component.html",
  styleUrls: ["./cadastro-filmes.component.scss"],
})
export class CadastroFilmesComponent implements OnInit {
  id: number;
  cadastro: FormGroup;
  generos: Array<string>;
  constructor(
    public validacao: ValidarCamposService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private filmesService: FilmesService,
    private generosService: GenerosService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  get f() {
    return this.cadastro.controls;
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params["id"];
    if (this.id) {
      this.filmesService.visualizar(this.id).subscribe((filme) => {
        this.criarFormulario(filme);
      });
    } else {
      this.criarFormulario(this.criarFilmeEmBranco());
    }
    this.generos = this.generosService.generosFilmes();
  }

  submit(): void {
    this.cadastro.markAllAsTouched();
    if (this.cadastro.invalid) {
      return;
    }
    /**
     * O trecho abaixo atribui cada valor de cada campo presente
     * no formulário 'cadastro' e atribui a constante 'filme'.
     * Já o '...as Filme' garante que os valores presentes em
     * 'cadastro' são do tipo filme.
     */
    const filme: Filme = this.cadastro.getRawValue() as Filme;
    if (this.id) {
      this.editar(filme);
    } else {
      this.salvar(filme);
    }
  }

  reiniciarForm(): void {
    this.cadastro.reset();
  }

  private salvar(filme: Filme): void {
    this.filmesService.salvar(filme).subscribe(
      () => {
        const config = {
          data: {
            descricao: "Filme registrado com sucesso!",
            btnSucesso: "Ir para listagem de Filmes",
            btnCancelar: "Cadastrar novo Filme",
            possuiBtnFechar: true,
          } as Alerta,
        };
        const dialogRef = this.dialog.open(AlertaComponent, config);
        /**
         * O trecho de código abaixo recebe informações do componente
         * 'alerta'. Essa informação é capturada depois que o componete
         * é fechado, por isso o método 'afterClosed()' é chamado.
         * Observer que o método retorna um Observable, o que faz com que
         * seja necessário se inscrever para que o processo seja realizado.
         *
         * A informação capturada parte do HTML do componente, no
         * trecho: '[mat-dialog-close]="true"' (para o botão de sucesso)
         * e '[mat-dialog-close]="false"' (para o botão de cancelar).
         * Com essa informação, é possível tomar uma decisão de acordo
         * com o que o usuário selecionar.
         */
        dialogRef.afterClosed().subscribe((opcao: boolean) => {
          if (opcao) {
            this.route.navigate(["filmes"]);
          } else {
            this.reiniciarForm();
          }
        });
      },
      (error) => {
        const config = {
          data: {
            titulo: "Erro ao salvar o registro!",
            descricao:
              "Não foi possível salvar seu registro." +
              "Tente novamente mais tarde.",
            corBtnSucesso: "warn",
            btnSucesso: "Fechar",
          } as Alerta,
        };
        this.dialog.open(AlertaComponent, config);
      }
    );
  }

  private editar(filme: Filme): void {
    this.filmesService.editar(filme).subscribe(
      () => {
        const config = {
          data: {
            descricao: "Seu filme foi atualizado com sucesso!",
            btnSucesso: "Ir para listagem de Filmes",
          } as Alerta,
        };
        const dialogRef = this.dialog.open(AlertaComponent, config);
        dialogRef.afterClosed().subscribe(() => {
          this.route.navigate(["filmes"]);
        });
      },
      (error) => {
        const config = {
          data: {
            titulo: "Erro ao atualizar o registro!",
            descricao:
              "Não foi possível atualizar seu registro." +
              "Tente novamente mais tarde.",
            corBtnSucesso: "warn",
            btnSucesso: "Fechar",
          } as Alerta,
        };
        this.dialog.open(AlertaComponent, config);
      }
    );
  }

  private criarFormulario(filme: Filme): void {
    this.cadastro = this.fb.group({
      id: [filme.id],
      titulo: [
        filme.titulo,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(256),
        ],
      ],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dtLancamento: [filme.dtLancamento, [Validators.required]],
      descricao: [filme.descricao],
      nota: [
        filme.nota,
        [Validators.required, Validators.min(0), Validators.max(10)],
      ],
      urlIMDb: [filme.urlIMDb, [Validators.minLength(10)]],
      genero: [filme.genero, [Validators.required]],
    });
  }

  private criarFilmeEmBranco(): Filme {
    return {
      id: null,
      titulo: null,
      urlFoto: null,
      dtLancamento: null,
      descricao: null,
      nota: null,
      urlIMDb: null,
      genero: null,
    } as Filme;
  }
}
