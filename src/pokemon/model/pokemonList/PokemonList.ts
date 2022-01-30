import { IPokemonListItem } from "./PokemonListItem";

export interface IPokemonList {
  count: number;
  next: string;
  previous: string;
  results: IPokemonListItem[];
}
