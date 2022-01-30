import React from "react";
import { Button, Col, Input, Row, Select, Switch } from "antd";
import PokemonListBy from "../pokemonListBy/PokemonListBy";
import PokemonList from "./PokemonList";
import PokemonLoader from "../../../../common/component/common/pokemonLoader/PokemonLoader";
import { IPokemon } from "../../../model/pokemon/Pokemon";
import { IPokemonList } from "../../../model/pokemonList/PokemonList";
import { IPokemonListBy } from "../../../model/pokemonListBy/PokemonListBy";
import { IPokemonCharacteristicList } from "../../../model/pokemonCharacteristics/PokemonCharacteristicList";
import { IPokemonListItem } from "../../../model/pokemonList/PokemonListItem";
import { IPokemonListByItem } from "../../../model/pokemonListBy/PokemonListByItem";

interface IPokemonViewOwnProps {
  pokemon: IPokemon;
  pokemonList: IPokemonList;
  pokemonListBy: IPokemonListBy;
  pokemonCharacteristicList: IPokemonCharacteristicList;
  selectCharacteristics: string;

  onSelectCharacteristics: () => void;
  onListByCharacteristic: (e: string) => void;
  onShowAll: () => void;
  onInputValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchPokemon: () => void;
  onRowClick: (pokemon: IPokemonListItem) => void;
  onRowClickBy: (pokemon: IPokemonListByItem) => void;
}

type IPokemonViewProps = IPokemonViewOwnProps;

function PokemonView<T>(props: IPokemonViewProps) {
  let options;
  if (props.pokemonCharacteristicList) {
    options = props.pokemonCharacteristicList.results.map((data: any) => {
      return {
        label: data.name,
        value: data.url,
      };
    });
  }
  return props.pokemonList || props.pokemonListBy ? (
    <div className="pokemon-list__container">
      <Row>
        <Col span={24}>
          <span className="pokemon-list__banner">{"We got 'em all!"}</span>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Button
            className="pokemon-list__buttonShowAll"
            onClick={props.onShowAll}
          >
            {props.pokemonListBy || props.pokemon
              ? "VIEW FULL LIST"
              : "SHOW ALL POKEMON"}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={2} xl={2}>
          <Switch
            onChange={props.onSelectCharacteristics}
            unCheckedChildren={"T"}
            checkedChildren={"A"}
          />
        </Col>
        <Col xs={10} xl={10}>
          <Select
            allowClear={true}
            placeholder={props.selectCharacteristics}
            onSelect={props.onListByCharacteristic}
            style={{ width: "200px" }}
            options={options}
          />
        </Col>
        <Col xs={10} xl={10}>
          <Input
            allowClear={true}
            onChange={props.onInputValue}
            style={{ width: "200px" }}
            placeholder={"Enter name"}
          />
        </Col>
        <Col xs={2} xl={2}>
          <Button
            className="pokemon-list__buttonGo"
            onClick={props.onSearchPokemon}
          >
            {"GO"}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {props.pokemonListBy ? (
            <PokemonListBy
              pokemonList={props.pokemonListBy.pokemon}
              onRowClick={props.onRowClickBy}
            />
          ) : (
            <PokemonList
              pokemonList={
                props.pokemon
                  ? [props.pokemon.species]
                  : props.pokemonList.results
              }
              onRowClick={props.onRowClick}
            />
          )}
        </Col>
      </Row>
    </div>
  ) : (
    <PokemonLoader />
  );
}

export default PokemonView;
