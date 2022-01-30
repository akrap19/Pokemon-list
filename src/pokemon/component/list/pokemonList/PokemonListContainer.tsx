import React, { ChangeEventHandler } from "react";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import PokemonListBusinessStore from "../../../service/business/PokemonListBusinessStore";
import withCollectionParams, {
  IWithCollectionParamsOwnProps,
} from "../../../../common/component/collectionParams/withCollectionParams";
import { connect } from "react-redux";
import { IPokemonList } from "../../../model/pokemonList/PokemonList";
import PokemonList from "./PokemonList";
import { IPokemonListItem } from "../../../model/pokemonList/PokemonListItem";
import { Button, Input, Select, Switch } from "antd";
import PokemonCharacteristicListBusinessStore from "../../../service/business/PokemonCharacteristicListBusinessStore";
import { IPokemonCharacteristicList } from "../../../model/pokemonCharacteristics/PokemonCharacteristicList";
import PokemonListByBusinessStore from "../../../service/business/PokemonListByBusinessStore";
import { IPokemonListBy } from "../../../model/pokemonListBy/PokemonListBy";
import PokemonListBy from "../pokemonListBy/PokemonListBy";
import { IPokemonListByItem } from "../../../model/pokemonListBy/PokemonListByItem";
import PokemonBusinessStore from "../../../service/business/PokemonBusinessStore";
import { IPokemon } from "../../../model/pokemon/Pokemon";
import PokemonLoader from "../../../../common/component/common/pokemonLoader/PokemonLoader";
import PokemonListView from "./PokemonListView";

// -- Prop types
// ----------

export interface IPokemonListContainerOwnProps {}
export interface IPokemonListContainerStateProps {
  pokemon: IPokemon;
  pokemonList: IPokemonList;
  pokemonListBy: IPokemonListBy;
  pokemonCharacteristicList: IPokemonCharacteristicList;
}
export interface IPokemonListContainerDispatchProps {
  fetchPokemon: (id: string) => void;
  fetchPokemonList: (id: string) => void;
  fetchPokemonListBy: (characteristics: string, type: string) => void;
  fetchPokemonCharacteristicList: (id: string) => void;
  clearPokemonData: () => void;
  clearPokemonListData: () => void;
  clearPokemonListByData: () => void;
  clearPokemonCharacteristicListData: () => void;
}
type IPokemonListContainerProps = IPokemonListContainerOwnProps &
  IPokemonListContainerStateProps &
  IPokemonListContainerDispatchProps &
  IWithCollectionParamsOwnProps<any> &
  RouteComponentProps;

interface IPokemonListContainerState {
  pokeListSize: number;
  selectCharacteristics: string;
  pokemonNameForSearch?: string;
}

// -- Component
// ----------

/** Disounts list container component */
class PokemonListContainer extends React.Component<
  IPokemonListContainerProps,
  IPokemonListContainerState
> {
  state: IPokemonListContainerState = {
    pokeListSize: 50,
    selectCharacteristics: "type",
  };

  isBottom(el: any) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  componentDidMount = () => {
    this.loadPokemonList(this.state.pokeListSize.toString());
    this.loadCharacteristicList(this.state.selectCharacteristics);
    document.addEventListener("scroll", this.trackScrolling);
  };

  componentDidUpdate(
    prevProps: Readonly<IPokemonListContainerProps>,
    prevState: Readonly<IPokemonListContainerState>,
    snapshot?: any
  ) {
    if (this.state.pokeListSize !== prevState.pokeListSize) {
      this.loadPokemonList(this.state.pokeListSize.toString());
    }
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.trackScrolling);
    this.props.clearPokemonData();
    this.props.clearPokemonListData();
    this.props.clearPokemonListByData();
    this.props.clearPokemonCharacteristicListData();
  }

  trackScrolling = () => {
    const wrappedElement = document.querySelector(".ant-table");
    if (this.isBottom(wrappedElement)) {
      this.setState({ pokeListSize: this.state.pokeListSize + 50 });
      this.loadPokemonList(this.state.pokeListSize.toString());
    }
  };

  handleRowClick = (pokemon: IPokemonListItem) => {
    this.props.history.push(`/pokemon/${pokemon.name}`);
  };

  handleRowClickBy = (pokemon: IPokemonListByItem) => {
    this.props.history.push(`/pokemon/${pokemon.pokemon.name}`);
  };

  handleShowAll = () => {
    if (this.props.pokemonListBy) {
      this.props.clearPokemonListByData();
    } else if (this.props.pokemon) {
      this.props.clearPokemonData();
    } else {
      this.setState({ pokeListSize: this.props.pokemonList.count });
    }
  };

  handleListByCharacteristic = (e: string) => {
    const urlSubstring = e.substring(1, e.lastIndexOf("/"));
    this.loadPokemonListBy(
      "type",
      urlSubstring.substring(urlSubstring.lastIndexOf("/") + 1)
    );
  };

  handleSelectCharacteristics = () => {
    if (this.state.selectCharacteristics === "type") {
      this.setState({ selectCharacteristics: "ability" });
      this.loadCharacteristicList("ability");
    } else {
      this.setState({ selectCharacteristics: "type" });
      this.loadCharacteristicList("type");
    }
  };

  handleInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ pokemonNameForSearch: event.target.value });
  };

  handleSearchPokemon = () => {
    if (this.props.pokemonListBy) {
      this.props.clearPokemonListByData();
    }
    if (this.state.pokemonNameForSearch) {
      this.loadPokemon(this.state.pokemonNameForSearch);
    }
  };

  render = () => {
    return (
      <PokemonListView
        pokemon={this.props.pokemon}
        pokemonList={this.props.pokemonList}
        pokemonListBy={this.props.pokemonListBy}
        pokemonCharacteristicList={this.props.pokemonCharacteristicList}
        selectCharacteristics={this.state.selectCharacteristics}
        onSelectCharacteristics={this.handleSelectCharacteristics}
        onListByCharacteristic={this.handleListByCharacteristic}
        onShowAll={this.handleShowAll}
        onInputValue={this.handleInputValue}
        onSearchPokemon={this.handleSearchPokemon}
        onRowClick={this.handleRowClick}
        onRowClickBy={this.handleRowClickBy}
      />
    );
  };

  private loadPokemon = (name: string) => {
    this.props.fetchPokemon(name);
  };

  private loadPokemonList = (listSize: string) => {
    this.props.fetchPokemonList(listSize);
  };

  private loadPokemonListBy = (characteristics: string, type: string) => {
    this.props.fetchPokemonListBy(characteristics, type);
  };

  private loadCharacteristicList = (characteristics: string) => {
    this.props.fetchPokemonCharacteristicList(characteristics);
  };
}

// -- HOCs and exports
// ----------

// `state` parameter needs a type annotation to type-check the correct shape of a state object but also it'll be used by "type inference" to infer the type of returned props
const mapStateToProps = (
  state: any,
  ownProps: IPokemonListContainerOwnProps
): IPokemonListContainerStateProps => ({
  // exmaple of state prop
  pokemon: PokemonBusinessStore.selectors.getPokemon(state),
  pokemonList: PokemonListBusinessStore.selectors.getPokemonList(state),
  pokemonListBy: PokemonListByBusinessStore.selectors.getPokemonListBy(state),
  pokemonCharacteristicList:
    PokemonCharacteristicListBusinessStore.selectors.getPokemonCharacteristicList(
      state
    ),
});

// `dispatch` parameter needs a type annotation to type-check the correct shape of an action object when using dispatch function
const mapDispatchToProps = (
  dispatch: any
): IPokemonListContainerDispatchProps => ({
  // exmaples of dispatch prop
  fetchPokemon: (name: string) =>
    dispatch(PokemonBusinessStore.actions.fetchPokemon({ name })),
  fetchPokemonList: (listSize: string) =>
    dispatch(PokemonListBusinessStore.actions.fetchPokemonList({ listSize })),
  fetchPokemonListBy: (characteristics: string, type: string) =>
    dispatch(
      PokemonListByBusinessStore.actions.fetchPokemonListBy({
        characteristics,
        type,
      })
    ),
  fetchPokemonCharacteristicList: (listSize: string) =>
    dispatch(
      PokemonCharacteristicListBusinessStore.actions.fetchPokemonCharacteristicList(
        { listSize }
      )
    ),
  clearPokemonListData: () =>
    dispatch(PokemonListBusinessStore.actions.clearPokemonListData()),
  clearPokemonListByData: () =>
    dispatch(PokemonListByBusinessStore.actions.clearPokemonListByData()),
  clearPokemonCharacteristicListData: () =>
    dispatch(
      PokemonCharacteristicListBusinessStore.actions.clearPokemonCharacteristicListData()
    ),
  clearPokemonData: () =>
    dispatch(PokemonBusinessStore.actions.clearPokemonData()),
});

export default connect<
  IPokemonListContainerStateProps,
  IPokemonListContainerDispatchProps,
  IPokemonListContainerOwnProps
>(
  mapStateToProps,
  mapDispatchToProps
)(withCollectionParams(withRouter(PokemonListContainer as any)));
