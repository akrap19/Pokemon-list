import { combineEpics, createEpicMiddleware } from "redux-observable";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import UserFeedbackBusinessStore from "../../../../common/service/business/userfeedback/userFeedbackBusinessProvider";
import { ROOT_STORE_REGISTRY_KEY } from "../../../../common/service/business/rootStoreAccess";
import { register } from "../../../../common/service/registry/dependencyRegistry";
import PokemonListBusinessStore from "../../../../pokemon/service/business/PokemonListBusinessStore";
import PokemonBusinessStore from "../../../../pokemon/service/business/PokemonBusinessStore";
import PokemonListByBusinessStore from "../../../../pokemon/service/business/PokemonListByBusinessStore";
import PokemonCharacteristicListBusinessStore from "../../../../pokemon/service/business/PokemonCharacteristicListBusinessStore";

function initializeRootStore() {
  const epicMiddleware = createEpicMiddleware();
  const rootEpic = combineEpics(
    ...Object.keys(UserFeedbackBusinessStore.effects).map(
      (key) => (UserFeedbackBusinessStore.effects as any)[key]
    ),
    ...Object.keys(PokemonListBusinessStore.effects).map(
      (key) => (PokemonListBusinessStore.effects as any)[key]
    ),
    ...Object.keys(PokemonListByBusinessStore.effects).map(
      (key) => (PokemonListByBusinessStore.effects as any)[key]
    ),
    ...Object.keys(PokemonCharacteristicListBusinessStore.effects).map(
      (key) => (PokemonCharacteristicListBusinessStore.effects as any)[key]
    ),
    ...Object.keys(PokemonBusinessStore.effects).map(
      (key) => (PokemonBusinessStore.effects as any)[key]
    )
  );

  const rootReducer = combineReducers({
    ...UserFeedbackBusinessStore.reducers,
    ...PokemonListBusinessStore.reducers,
    ...PokemonListByBusinessStore.reducers,
    ...PokemonCharacteristicListBusinessStore.reducers,
    ...PokemonBusinessStore.reducers,
  });

  // logger
  const logger = createLogger({
    collapsed: true,
  });

  const store = createStore(
    rootReducer,
    compose(applyMiddleware(epicMiddleware, logger))
  );

  epicMiddleware.run(rootEpic);
  console.log("store", store);

  register(ROOT_STORE_REGISTRY_KEY, store);
}

export { initializeRootStore };
