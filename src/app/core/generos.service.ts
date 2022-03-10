import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GenerosService {
  constructor() {}

  generosFilmes(): Array<string> {
    let generos: Array<string>;
    generos = [
      "Ação",
      "Biográfico",
      "Comédia dramática",
      "Comédia romântica",
      "Histórico",
      "Musical",
      "Comédia",
      "Suspense",
      "Aventura",
      "Romance",
      "Terror",
      "Ficção Científica",
      "Fantasia",
      "Drama",
    ];
    generos.sort();
    return generos;
  }
}
