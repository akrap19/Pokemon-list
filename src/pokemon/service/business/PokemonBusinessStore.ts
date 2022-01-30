import { StateObservable } from "redux-observable";
import { Observable } from "rxjs";
import { catchError, filter, map, mergeMap } from "rxjs/operators";
import { getLogger } from "../../../common/service/util/logging/logger";
import { IPokemon } from "../../model/pokemon/Pokemon";
import {
  INamedPayload,
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
import { message } from "antd";

const LOGGER = getLogger("PokemonBusinessStore");

// -
// -------------------- Types&Consts
export interface IPokemonRoleListFilter {}
// List filter ID

// -
// -------------------- Selectors

/** Returns pokemon from store. */
const getPokemon = (store: any): IPokemon => store.pokemonView;
// -
// -------------------- Actions

const Actions = {
  POKEMON_FETCH: "POKEMON_FETCH",
  POKEMON_LOAD: "POKEMON_LOAD",
  POKEMON_CLEAR: "POKEMON_CLEAR",
};

/** Fetch mesure unit by ID. */
const fetchPokemon = (params: INamedPayload): IPayloadAction<INamedPayload> => {
  return {
    type: Actions.POKEMON_FETCH,
    payload: params,
  };
};

/** Load pokemon to store. */
const loadPokemon = (data: IPokemon): IPayloadAction<IPokemon> => {
  return {
    type: Actions.POKEMON_LOAD,
    payload: data,
  };
};

/** Clear pokemon from store. Eg. when leaving view. */
const clearPokemonData = (): Action<string> => {
  return {
    type: Actions.POKEMON_CLEAR,
  };
};

const fetchPokemonEffect = (
  action$: Observable<IPayloadAction<INamedPayload>>,
  state$: StateObservable<any>
) => {
  return action$.pipe(
    filter((action) => {
      return action.type === Actions.POKEMON_FETCH;
    }),

    startGlobalProgress(),

    mergeMap((action) => {
      const { name } = action.payload;

      return EntityApiService.create()
        .fetchByUrl<IPokemon>("https://pokeapi.co/api/v2/pokemon/" + name)
        .pipe(trackAction(action));
    }),

    stopGlobalProgress(),

    map((data: any) => {
      return loadPokemon(data.data);
    }),

    reportCaughtMessage((error: any) =>
      createStaticMessageUserFeedbackError(
        "GENERAL_MESSAGE.GENERAL_FETCH_ERROR"
      )
    ),

    catchError((error: any, o: Observable<any>) => {
      message.error("De nada amigo!");
      LOGGER.error("Error fetching pokemon list", error);
      return o;
    })
  );
};

// -
// -------------------- Reducers

const pokemonView = (
  state: IPokemon | null = null,
  action: IPayloadAction<IPokemon>
) => {
  if (action.type === Actions.POKEMON_LOAD) {
    return {
      ...action.payload,
    };
  } else if (action.type === Actions.POKEMON_CLEAR) {
    return null;
  }

  return state;
};

// --
// -------------------- Business Store

export const PokemonBusinessStore = {
  actions: {
    fetchPokemon,
    loadPokemon,
    clearPokemonData,
  },

  selectors: {
    getPokemon,
  },

  effects: {
    fetchPokemonEffect,
  },

  reducers: {
    pokemonView,
  },
};

// --
// export business store
export default PokemonBusinessStore;
