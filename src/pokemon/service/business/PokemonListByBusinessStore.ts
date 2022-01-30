import { StateObservable } from "redux-observable";
import { Observable } from "rxjs";
import { catchError, filter, map, mergeMap } from "rxjs/operators";
import { getLogger } from "../../../common/service/util/logging/logger";
import { IPokemonListBy } from "../../model/pokemonListBy/PokemonListBy";
import {
  ICharacteristicsTypedPayload,
  IPayloadAction,
} from "../../../common/service/business/common/types";
import {
  startGlobalProgress,
  stopGlobalProgress,
  trackAction,
} from "../../../common/service/util/observable";
import { reportCaughtMessage } from "../../../common/service/util/observable/userFeedback";
import { createStaticMessageUserFeedbackError } from "../../../common/service/business/userfeedback/userFeedbackUtils";
import EntityApiService from "../../../common/service/util/api/EntityApiService";
import { Action } from "redux";

const LOGGER = getLogger("PokemonListByBusinessStore");

// -
// -------------------- Types&Consts
export interface IPokemonListByRoleListFilter {}
// List filter ID

// -
// -------------------- Selectors

/** Returns pokemonListBy from store. */
const getPokemonListBy = (store: any): IPokemonListBy =>
  store.pokemonListByView;
// -
// -------------------- Actions

const Actions = {
  POKEMON_LIST_BY_FETCH: "POKEMON_LIST_BY_FETCH",
  POKEMON_LIST_BY_LOAD: "POKEMON_LIST_BY_LOAD",
  POKEMON_LIST_BY_CLEAR: "POKEMON_LIST_BY_CLEAR",
};

const fetchPokemonListBy = (
  params: ICharacteristicsTypedPayload
): IPayloadAction<ICharacteristicsTypedPayload> => {
  return {
    type: Actions.POKEMON_LIST_BY_FETCH,
    payload: params,
  };
};

/** Load pokemonListBy to store. */
const loadPokemonListBy = (
  data: IPokemonListBy
): IPayloadAction<IPokemonListBy> => {
  return {
    type: Actions.POKEMON_LIST_BY_LOAD,
    payload: data,
  };
};

/** Clear pokemonListBy from store. Eg. when leaving view. */
const clearPokemonListByData = (): Action<string> => {
  return {
    type: Actions.POKEMON_LIST_BY_CLEAR,
  };
};

const fetchPokemonListByEffect = (
  action$: Observable<IPayloadAction<ICharacteristicsTypedPayload>>,
  state$: StateObservable<any>
) => {
  return action$.pipe(
    filter((action) => {
      return action.type === Actions.POKEMON_LIST_BY_FETCH;
    }),

    startGlobalProgress(),

    mergeMap((action) => {
      return EntityApiService.create()
        .fetchByUrl<IPokemonListBy>(
          "https://pokeapi.co/api/v2/" +
            action.payload.characteristics +
            "/" +
            action.payload.type
        )
        .pipe(trackAction(action));
    }),

    stopGlobalProgress(),

    map((data: any) => {
      return loadPokemonListBy(data.data);
    }),

    reportCaughtMessage((error: any) =>
      createStaticMessageUserFeedbackError(
        "GENERAL_MESSAGE.GENERAL_FETCH_ERROR"
      )
    ),

    catchError((error: any, o: Observable<any>) => {
      LOGGER.error("Error fetching pokemon list", error);
      return o;
    })
  );
};

// -
// -------------------- Reducers

const pokemonListByView = (
  state: IPokemonListBy | null = null,
  action: IPayloadAction<IPokemonListBy>
) => {
  if (action.type === Actions.POKEMON_LIST_BY_LOAD) {
    return {
      ...action.payload,
    };
  } else if (action.type === Actions.POKEMON_LIST_BY_CLEAR) {
    return null;
  }

  return state;
};

// --
// -------------------- Business Store

export const PokemonListByBusinessStore = {
  actions: {
    fetchPokemonListBy,
    loadPokemonListBy,
    clearPokemonListByData,
  },

  selectors: {
    getPokemonListBy,
  },

  effects: {
    fetchPokemonListByEffect,
  },

  reducers: {
    pokemonListByView,
  },
};

// --
// export business store
export default PokemonListByBusinessStore;
