import React from "react";
import { Button } from "antd";
import { IPokemon } from "../../model/pokemon/Pokemon";
import Pokedex from "../../../common/asset/img/pokedex.png";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface IPokemonViewOwnProps {
  pokemon: IPokemon;
  handleModal: (type: string) => void;
}

type IPokemonViewProps = IPokemonViewOwnProps;

function PokemonView<T>(props: IPokemonViewProps) {
  const getPokemonTypes = () => {
    return props.pokemon.types.map((t) => {
      return (
        <Button
          className="pokemon-view__typesButton"
          onClick={() => props.handleModal(t.type.name)}
        >
          {t.type.name.toUpperCase()}
        </Button>
      );
    });
  };

  return (
    <div className="pokemon-view center">
      <span className="pokemon-view__label center">{props.pokemon.name}</span>
      <div className="pokemon-view__types center">{getPokemonTypes()}</div>
      <img className="pokemon-view__pokedexImg center" src={Pokedex} />
      <div className="pokemon-view__carouselContainer">
        {props.pokemon.sprites.front_default &&
        props.pokemon.sprites.back_default ? (
          <Carousel showStatus={false} showThumbs={false} showArrows={false}>
            <div>
              <img src={props.pokemon.sprites.front_default} />
            </div>
            <div>
              <img src={props.pokemon.sprites.back_default} />
            </div>
          </Carousel>
        ) : (
          <img
            className="pokemon-view__pokemonImg center"
            src="https://www.freeiconspng.com/uploads/3d-pokeball-pok-mon-go-png-24.png"
          />
        )}
      </div>
    </div>
  );
}

export default PokemonView;
