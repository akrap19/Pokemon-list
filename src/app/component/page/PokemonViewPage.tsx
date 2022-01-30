import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import PokemonViewContainer from "../../../pokemon/component/view/PokemonViewContainer";

export interface IPokemonViewPageRouteProps {
  name: string;
}

type IPokemonViewPageProps = IPokemonViewPageRouteProps &
  RouteComponentProps<IPokemonViewPageRouteProps>;

const PokemonViewPage: React.SFC<IPokemonViewPageProps> = (props) => (
  <PokemonViewContainer name={props.match.params.name} />
);

export default withRouter(PokemonViewPage);
