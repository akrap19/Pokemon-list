import { StateObservable } from "redux-observable";
import { Observable } from "rxjs";
import { catchError, filter, map, mergeMap } from "rxjs/operators";
import { getLogger } from "../../../common/service/util/logging/logger";
import { IPokemonList } from "../../model/pokemonList/PokemonList";
import {
  IIdPayload,
  IListSizedPayload,
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

const LOGGER = getLogger("PokemonListBusinessStore");

// -
// -------------------- Types&Consts
export interface IPokemonListRoleListFilter {}
// List filter ID

// -
// -------------------- Selectors

/** Returns pokemonList from store. */
const getPokemonList = (store: any): IPokemonList => store.pokemonListView;
// -
// -------------------- Actions

const Actions = {
  POKEMON_LIST_FETCH: "POKEMON_LIST_FETCH",
  POKEMON_LIST_LOAD: "POKEMON_LIST_LOAD",
  POKEMON_LIST_CLEAR: "POKEMON_LIST_CLEAR",
};

/** Fetch mesure unit by ID. */
const fetchPokemonList = (
  params: IListSizedPayload
): IPayloadAction<IListSizedPayload> => {
  return {
    type: Actions.POKEMON_LIST_FETCH,
    payload: params,
  };
};

/** Load pokemonList to store. */
const loadPokemonList = (data: IPokemonList): IPayloadAction<IPokemonList> => {
  return {
    type: Actions.POKEMON_LIST_LOAD,
    payload: data,
  };
};

/** Clear pokemonList from store. Eg. when leaving view. */
const clearPokemonListData = (): Action<string> => {
  return {
    type: Actions.POKEMON_LIST_CLEAR,
  };
};

const fetchPokemonListEffect = (
  action$: Observable<IPayloadAction<IListSizedPayload>>,
  state$: StateObservable<any>
) => {
  return action$.pipe(
    filter((action) => {
      return action.type === Actions.POKEMON_LIST_FETCH;
    }),

    startGlobalProgress(),

    mergeMap((action) => {
      const { listSize } = action.payload;

      return EntityApiService.create()
        .fetchByUrl<IPokemonList>(
          "https://pokeapi.co/api/v2/pokemon?limit=" + listSize
        )
        .pipe(trackAction(action));
    }),

    stopGlobalProgress(),

    map((data: any) => {
      return loadPokemonList(data.data);
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

const pokemonListView = (
  state: IPokemonList | null = null,
  action: IPayloadAction<IPokemonList>
) => {
  if (action.type === Actions.POKEMON_LIST_LOAD) {
    return {
      ...action.payload,
    };
  } else if (action.type === Actions.POKEMON_LIST_CLEAR) {
    return null;
  }

  return state;
};

// --
// -------------------- Business Store

export const PokemonListBusinessStore = {
  actions: {
    fetchPokemonList,
    loadPokemonList,
    clearPokemonListData,
  },

  selectors: {
    getPokemonList,
  },

  effects: {
    fetchPokemonListEffect,
  },

  reducers: {
    pokemonListView,
  },
};

// --
// export business store
export default PokemonListBusinessStore;
