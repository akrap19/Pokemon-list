import { IType } from "./Type";
import { ISprites } from "./Sprites";
import { ISpecies } from "./Species";

export interface IPokemon {
  name: string;
  species: ISpecies;
  sprites: ISprites;
  types: IType[];
}
