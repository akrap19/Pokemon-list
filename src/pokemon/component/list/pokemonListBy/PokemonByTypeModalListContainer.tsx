import React from "react";
import { connect } from "react-redux";

import { Modal } from "antd";
import { RouteComponentProps, StaticContext, withRouter } from "react-router";
import DialogActionsURLHelper, {
  DialogActionTypesEnum,
  IDialogSearchParams,
} from "../../../../app/service/util/DialogActionsURLHelper";
import withCollectionParams from "../../../../common/component/collectionParams/withCollectionParams";
import "antd/dist/antd.css";
import PokemonListByBusinessStore from "../../../service/business/PokemonListByBusinessStore";
import { IPokemonListBy } from "../../../model/pokemonListBy/PokemonListBy";
import PokemonListBy from "./PokemonListBy";
import "./../../../../common/asset/style/index.less";
import { IPokemonListByItem } from "../../../model/pokemonListBy/PokemonListByItem";

// -- Prop types
// ----------
interface IPokemonByTypeModalListContainerRouteProps {}

interface IPokemonByTypeModalListContainerLocationState {}

export interface IPokemonByTypeModalListContainerOwnProps {}
export interface IPokemonByTypeModalListContainerStateProps {
  pokemonList: IPokemonListBy;
}
export interface IPokemonByTypeModalListContainerDispatchProps {
  fetchPokemonByList: (characteristics: string, type: string) => void;
  clearPokemonListByData: () => void;
}
type IPokemonByTypeModalListContainerProps =
  IPokemonByTypeModalListContainerOwnProps &
    IPokemonByTypeModalListContainerStateProps &
    IPokemonByTypeModalListContainerDispatchProps &
    RouteComponentProps<
      IPokemonByTypeModalListContainerRouteProps,
      StaticContext,
      IPokemonByTypeModalListContainerLocationState
    >;

interface IPokemonByTypeModalListContainerState {
  dialogParams?: IDialogSearchParams;
}

// -- Component
// ----------

/** Describe your component ... */
class PokemonByTypeModalListContainer extends React.Component<
  IPokemonByTypeModalListContainerProps,
  IPokemonByTypeModalListContainerState
> {
  state: IPokemonByTypeModalListContainerState = {};

  componentDidMount() {
    this.checkParams();
  }

  componentDidUpdate(prevProps: IPokemonByTypeModalListContainerProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.checkParams();
    }
  }

  componentWillUnmount() {
    this.props.clearPokemonListByData();
  }

  checkParams = () => {
    const dialogParams = DialogActionsURLHelper.createDialogParams(
      this.props.location.search
    );
    this.setState({ dialogParams });
    if (dialogParams.type) {
      this.props.fetchPokemonByList("type", dialogParams.type);
    }
  };

  goBack = () => {
    this.props.history.goBack();
  };

  handleRowClick = (pokemon: IPokemonListByItem) => {
    this.props.history.push(`/pokemon/${pokemon.pokemon.name}`);
  };

  render = () => {
    const action = this.state.dialogParams?.action;
    const showModal = action === DialogActionTypesEnum.FETCH_LIST;

    if (this.props.pokemonList) {
      return (
        <Modal
          className="modal"
          style={{ maxHeight: "300px" }}
          title={this.state.dialogParams?.type}
          visible={showModal}
          onCancel={this.goBack}
        >
          <PokemonListBy
            pokemonList={this.props.pokemonList.pokemon}
            onRowClick={this.handleRowClick}
            scrollY={350}
          />
        </Modal>
      );
    } else {
      return null;
    }
  };
}

// -- HOCs and exports
// ----------

// `state` parameter needs a type annotation to type-check the correct shape of a state object but also it'll be used by "type inference" to infer the type of returned props
const mapStateToProps = (
  state: any,
  ownProps: IPokemonByTypeModalListContainerOwnProps
): IPokemonByTypeModalListContainerStateProps => ({
  pokemonList: PokemonListByBusinessStore.selectors.getPokemonListBy(state),
});

// `dispatch` parameter needs a type annotation to type-check the correct shape of an action object when using dispatch function
const mapDispatchToProps = (
  dispatch: any
): IPokemonByTypeModalListContainerDispatchProps => ({
  fetchPokemonByList: (characteristics: string, type: string) =>
    dispatch(
      PokemonListByBusinessStore.actions.fetchPokemonListBy({
        characteristics,
        type,
      })
    ),
  clearPokemonListByData: () =>
    dispatch(PokemonListByBusinessStore.actions.clearPokemonListByData()),
});

export default connect<
  IPokemonByTypeModalListContainerStateProps,
  IPokemonByTypeModalListContainerDispatchProps,
  IPokemonByTypeModalListContainerOwnProps
>(
  mapStateToProps,
  mapDispatchToProps
)(withCollectionParams(withRouter(PokemonByTypeModalListContainer) as any));
