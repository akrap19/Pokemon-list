import { Observable, Observer } from "rxjs";
import {IAction} from "../../business/common/types";
import {TrackingHelper} from "../tracking/tracking";

/** Tracking action RxJS operator which takes care of simple success/error handling and tracking it back through tracking chain. */
export default (action: IAction) => {
  console.log("action", action);
  // create and return pure operator function
  return <T>(source: Observable<T>): Observable<T> => {
    return Observable.create((subscriber: Observer<T>) => {
      return source.subscribe(
        (data: T) => {
          try {
            subscriber.next(data);
            TrackingHelper.success(action, data);
          } catch (err) {
            subscriber.error(err);
            TrackingHelper.error(action, err);
          }
        },
        (err) => {
          subscriber.error(err);
          TrackingHelper.error(action, err);
        },
        () => {
          subscriber.complete();
        }
      );
    });
  };
};
