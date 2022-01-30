import { StateObservable } from "redux-observable";
import { Observable } from "rxjs";
import { catchError, filter, map, mergeMap } from "rxjs/operators";
import { getLogger } from "../../../common/service/util/logging/logger";
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
import { IPokemonCharacteristicList } from "../../model/pokemonCharacteristics/PokemonCharacteristicList";

const LOGGER = getLogger("PokemonCharacteristicListBusinessStore");

// -
// -------------------- Types&Consts
export interface IPokemonCharacteristicListRoleListFilter {}
// List filter ID

// -
// -------------------- Selectors

/** Returns pokemonCharacteristicList from store. */
const getPokemonCharacteristicList = (store: any): IPokemonCharacteristicList =>
  store.pokemonCharacteristicListView;
// -
// -------------------- Actions

const Actions = {
  POKEMON_CHARACTERISTIC_LIST_FETCH: "POKEMON_CHARACTERISTIC_LIST_FETCH",
  POKEMON_CHARACTERISTIC_LIST_LOAD: "POKEMON_CHARACTERISTIC_LIST_LOAD",
  POKEMON_CHARACTERISTIC_LIST_CLEAR: "POKEMON_CHARACTERISTIC_LIST_CLEAR",
};

/** Fetch mesure unit by ID. */
const fetchPokemonCharacteristicList = (
  params: IListSizedPayload
): IPayloadAction<IListSizedPayload> => {
  return {
    type: Actions.POKEMON_CHARACTERISTIC_LIST_FETCH,
    payload: params,
  };
};

/** Load pokemonCharacteristicList to store. */
const loadPokemonCharacteristicList = (
  data: IPokemonCharacteristicList
): IPayloadAction<IPokemonCharacteristicList> => {
  return {
    type: Actions.POKEMON_CHARACTERISTIC_LIST_LOAD,
    payload: data,
  };
};

/** Clear pokemonCharacteristicList from store. Eg. when leaving view. */
const clearPokemonCharacteristicListData = (): Action<string> => {
  return {
    type: Actions.POKEMON_CHARACTERISTIC_LIST_CLEAR,
  };
};

const fetchPokemonCharacteristicListEffect = (
  action$: Observable<IPayloadAction<IListSizedPayload>>,
  state$: StateObservable<any>
) => {
  return action$.pipe(
    filter((action) => {
      return action.type === Actions.POKEMON_CHARACTERISTIC_LIST_FETCH;
    }),

    startGlobalProgress(),

    mergeMap((action) => {
      const { listSize } = action.payload;

      return EntityApiService.create()
        .fetchByUrl<IPokemonCharacteristicList>(
          "https://pokeapi.co/api/v2/" + listSize
        )
        .pipe(trackAction(action));
    }),

    stopGlobalProgress(),

    map((data: any) => {
      return loadPokemonCharacteristicList(data.data);
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

const pokemonCharacteristicListView = (
  state: IPokemonCharacteristicList | null = null,
  action: IPayloadAction<IPokemonCharacteristicList>
) => {
  if (action.type === Actions.POKEMON_CHARACTERISTIC_LIST_LOAD) {
    return {
      ...action.payload,
    };
  } else if (action.type === Actions.POKEMON_CHARACTERISTIC_LIST_CLEAR) {
    return null;
  }

  return state;
};

// --
// -------------------- Business Store

export const PokemonCharacteristicListBusinessStore = {
  actions: {
    fetchPokemonCharacteristicList,
    loadPokemonCharacteristicList,
    clearPokemonCharacteristicListData,
  },

  selectors: {
    getPokemonCharacteristicList,
  },

  effects: {
    fetchPokemonCharacteristicListEffect,
  },

  reducers: {
    pokemonCharacteristicListView,
  },
};

// --
// export business store
export default PokemonCharacteristicListBusinessStore;
