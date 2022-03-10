import { MatDialog } from "@angular/material";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Filme } from "./../../shared/models/filme";
import { FilmesService } from "./../../core/filmes.service";
import { AlertaComponent } from "src/app/shared/components/alerta/alerta.component";
import { Alerta } from "src/app/shared/models/alerta";

@Component({
  selector: "dio-visualizar-filmes",
  templateUrl: "./visualizar-filmes.component.html",
  styleUrls: ["./visualizar-filmes.component.scss"],
})
export class VisualizarFilmesComponent implements OnInit {
  filme: Filme;
  urlFotoGenerica =
    "https://triunfo.pe.gov.br/pm_tr430/wp-content/uploads/2018/03/sem-foto.jpg";
  id: number;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private filmesService: FilmesService,
    private route: Router
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params["id"];
    this.visualizar();
  }

  editar(): void {
    this.route.navigateByUrl(`/filmes/cadastro/${this.id}`);
  }

  excluir(): void {
    const config = {
      data: {
        titulo: "Tem certeza que deseja excluir?",
        descricao: "A ação não poderá ser desfeita.",
        corBtnCancelar: "primary",
        corBtnSucesso: "warn",
        btnSucesso: "Excluir",
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
        this.filmesService.excluir(this.id).subscribe(() => {
          alert(
            `O filme de ID: ${this.id} foi excluído.\nVocê será redirecionado para a página de início.`
          );
          this.route.navigateByUrl("/filmes");
        });
      }
    });
  }

  private visualizar(): void {
    this.filmesService.visualizar(this.id).subscribe((filme: Filme) => {
      this.filme = filme;
    });
  }
}
