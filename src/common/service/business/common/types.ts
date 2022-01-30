import { Action } from "redux";
import { Observable } from "rxjs";

/** Prototypes of business store functions. */
export type ActionFn = (...args: any[]) => any;
export type SelectorFn = (...args: any[]) => any;
export type EffectFn = (
  action$: Observable<IPayloadAction<any>>,
  state$: any
) => Observable<any>;
export type ReducerFn = (state: any, action: IPayloadAction<any>) => any;

/** Structure of every business store. */
export interface IBusinessStore {
  actions: { [key: string]: ActionFn };
  selectors: { [key: string]: SelectorFn };
  effects: { [key: string]: EffectFn };
  reducers: { [key: string]: ReducerFn };
}

/** Type interface for base redux action (no payload). */
export interface IAction extends Action<string> {}

/** Type interface for redux action with payload. */
export interface IPayloadAction<P> extends IAction {
  payload: P;
}

// --
// ----------- Utility action payloads

/** Describes payload with id property. */
export interface IIdPayload {
  id: string;
}

/** Describes payload with name property. */
export interface INamedPayload {
  name: string;
}

/** Describes payload with list size property. */
export interface IListSizedPayload {
  listSize: string;
}

/** Describes payload with characteristics property. */
export interface ICharacteristicsPayload {
  characteristics: string;
}

/** Describes payload with type and characteristics property. */
export interface ICharacteristicsTypedPayload {
  type: string;
  characteristics: string;
}

/** Describes action payload with name and additional data. */
export interface INameDataPayload<P> extends INamedPayload {
  data: P;
}

/** Describes action payload for fetching collections (list). */
export interface ICollectionFetchPayload<F> {
  /** Search data. # TODO: define search data format */
  filter?: F;
  /** Page number (0 indexed, defaults to 0). */
  page: number;
  /** Page size  (defaults to 20). */
  pagesize: number;
  /** Sort directives in the format: property_name(:direction)?, ... */
  sort?: ICollectionSorter[];
}

/** Collection sort order direction. */
export declare type CollectionSortOrder = "descend" | "ascend";

/** Collection sort order structure. */
export interface ICollectionSorter {
  field: string;
  direction: CollectionSortOrder;
}
