import React from "react";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router-dom";
import withCollectionParams, {
  IWithCollectionParamsOwnProps,
} from "../../../common/component/collectionParams/withCollectionParams";
import { connect } from "react-redux";
import PokemonBusinessStore from "../../service/business/PokemonBusinessStore";
import { IPokemon } from "../../model/pokemon/Pokemon";
import { Button } from "antd";
import DialogActionsURLHelper, {
  DialogActionTypesEnum,
} from "../../../app/service/util/DialogActionsURLHelper";
import PokemonByTypeModalListContainer from "../list/pokemonListBy/PokemonByTypeModalListContainer";
import PokemonView from "./PokemonView";
import PokemonLoader from "../../../common/component/common/pokemonLoader/PokemonLoader";

// -- Prop types
// ----------

export interface IPokemonViewContainerOwnProps {
  name: string;
}
export interface IPokemonViewContainerStateProps {
  pokemon: IPokemon;
}
export interface IPokemonViewContainerDispatchProps {
  fetchPokemon: (id: string) => void;
  clearPokemonData: () => void;
}
type IPokemonViewContainerProps = IPokemonViewContainerOwnProps &
  IPokemonViewContainerStateProps &
  IPokemonViewContainerDispatchProps &
  IWithCollectionParamsOwnProps<any> &
  RouteComponentProps;

interface IPokemonViewContainerState {}

// -- Component
// ----------

/** Disounts list container component */
class PokemonViewContainer extends React.Component<
  IPokemonViewContainerProps,
  IPokemonViewContainerState
> {
  state: IPokemonViewContainerState = {};

  componentDidMount = () => {
    this.props.fetchPokemon(this.props.name);
  };

  componentDidUpdate = (prevProps: IPokemonViewContainerProps) => {
    if (prevProps.name !== this.props.name) {
      this.props.fetchPokemon(this.props.name);
    }
  };

  componentWillUnmount = () => {
    this.props.clearPokemonData();
  };

  handleModal = (type: string) => {
    const newURLSearch: string = DialogActionsURLHelper.createUrlParams({
      action: DialogActionTypesEnum.FETCH_LIST,
      type: type,
    });

    this.props.history.push({
      pathname: "/pokemon/" + this.props.name,
      search: newURLSearch,
    });
  };

  render = () => {
    return this.props.pokemon ? (
      <div className="pokemon-view__container">
        <PokemonView
          pokemon={this.props.pokemon}
          handleModal={this.handleModal}
        />
        <PokemonByTypeModalListContainer />
      </div>
    ) : (
      <PokemonLoader />
    );
  };
}

// -- HOCs and exports
// ----------

// `state` parameter needs a type annotation to type-check the correct shape of a state object but also it'll be used by "type inference" to infer the type of returned props
const mapStateToProps = (
  state: any,
  ownProps: IPokemonViewContainerOwnProps
): IPokemonViewContainerStateProps => ({
  // exmaple of state prop
  pokemon: PokemonBusinessStore.selectors.getPokemon(state),
});

// `dispatch` parameter needs a type annotation to type-check the correct shape of an action object when using dispatch function
const mapDispatchToProps = (
  dispatch: any
): IPokemonViewContainerDispatchProps => ({
  // exmaples of dispatch prop
  fetchPokemon: (name: string) =>
    dispatch(PokemonBusinessStore.actions.fetchPokemon({ name })),
  clearPokemonData: () =>
    dispatch(PokemonBusinessStore.actions.clearPokemonData()),
});

export default connect<
  IPokemonViewContainerStateProps,
  IPokemonViewContainerDispatchProps,
  IPokemonViewContainerOwnProps
>(
  mapStateToProps,
  mapDispatchToProps
)(withCollectionParams(withRouter(PokemonViewContainer as any)));
