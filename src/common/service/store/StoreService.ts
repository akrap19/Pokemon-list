import { Store } from "redux";
import { IAction } from "../business/common/types";
import { resolve } from "../registry/dependencyRegistry";
import { ROOT_STORE_REGISTRY_KEY } from "../business/rootStoreAccess";
import { ConfigUtils } from "../util/config/ConfigUtils";

export type IStoreValueChangeCallback<T = any> = (next: T, current: T) => void;
export type IStoreValueComparator<T = any> = (current: T, next: T) => boolean;

/** Class with static methods for controlled access to redux store. */
export default class StoreService {
  /** Dispatch redux store action. */
  static dispatchAction(action: IAction): void {
    StoreService.getStore().dispatch(action);
  }

  /** Returns true if redux store has been initialized. */
  static isStoreInitialized(): boolean {
    return StoreService.getStore() != null;
  }

  /** Returns instance of redux action store. */
  static getStore(): Store {
    return resolve<Store>(ROOT_STORE_REGISTRY_KEY) as Store;
  }

  /** Return store value on given path. */
  static getValue = <T>(path: string): T => {
    return ConfigUtils.reducePath(StoreService.getStore().getState(), path);
  };

  /** Notify callback function if value store on path changes. */
  static watchValue = (
    path: string,
    callback: IStoreValueChangeCallback,
    compare?: IStoreValueComparator<any>
  ): void => {
    let currentValue = StoreService.getValue(path);

    StoreService.getStore().subscribe(() => {
      const nextValue = StoreService.getValue(path);

      if (
        (compare && compare(currentValue, nextValue)) ||
        currentValue === nextValue
      ) {
        const oldValue = currentValue;
        currentValue = nextValue;
        callback(currentValue, oldValue);
      }
    });
  };
}
