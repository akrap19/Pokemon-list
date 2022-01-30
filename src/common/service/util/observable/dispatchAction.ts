import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import {IAction} from "../../business/common/types";
import StoreService from "../../store/StoreService";

/** Call argument function and dispatch action returned by that function. */
export const dispatchAction = (actionFn: (value: any) => IAction) => {
  return <T>(source: Observable<T>): Observable<T> => {
    return source.pipe(
      tap((value) => {
        StoreService.dispatchAction(actionFn(value));
      })
    );
  };
};
