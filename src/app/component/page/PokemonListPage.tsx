import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import PokemonListContainer from "../../../pokemon/component/list/pokemonList/PokemonListContainer";

export interface IPokemonListPageRouteProps {}

type IPokemonListPageProps = IPokemonListPageRouteProps &
  RouteComponentProps<IPokemonListPageRouteProps>;

const PokemonListPage: React.SFC<IPokemonListPageProps> = (props) => (
  <PokemonListContainer />
);

export default withRouter(PokemonListPage);
