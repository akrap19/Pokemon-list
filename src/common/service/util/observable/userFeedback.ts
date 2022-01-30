import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import StoreService from "../../store/StoreService";
import UserFeedbackBusinessStore from "../../business/userfeedback/userFeedbackBusinessProvider";
import { IUserFeedbackMessagePayload } from "../../business/userfeedback/types";

/** Start user feedback progress with given ID. */
export const startProgress = (id: string) => {
  return createStartOperatorFn(() =>
    StoreService.dispatchAction(
      UserFeedbackBusinessStore.actions.startProgress(id)
    )
  );
};

/** Stop user feedback progress with given ID. */
export const stopProgress = (id: string) => {
  return createStopOperatorFn(() =>
    StoreService.dispatchAction(
      UserFeedbackBusinessStore.actions.stopProgress(id)
    )
  );
};

/** Start global user feedback progress. */
export const startGlobalProgress = () => {
  return createStartOperatorFn(() =>
    StoreService.dispatchAction(
      UserFeedbackBusinessStore.actions.startGlobalProgress()
    )
  );
};

/** Start global user feedback progress. */
export const stopGlobalProgress = () => {
  return createStopOperatorFn(() =>
    StoreService.dispatchAction(
      UserFeedbackBusinessStore.actions.stopGlobalProgress()
    )
  );
};

/** Report user feedback message. */
export const reportMessage = (
  fn: <V>(value: V) => IUserFeedbackMessagePayload
) => {
  return <T>(source: Observable<T>): Observable<T> => {
    return source.pipe(
      tap((value) => {
        StoreService.dispatchAction(
          UserFeedbackBusinessStore.actions.reportMessage(fn(value))
        );
      })
    );
  };
};

/** Catch error and report user feedback error message. */
export const reportCaughtMessage = (
  fn: <V>(error: V) => IUserFeedbackMessagePayload
) => {
  return <T>(source: Observable<T>): Observable<T> => {
    return source.pipe(
      catchError((error: any) => {
        StoreService.dispatchAction(
          UserFeedbackBusinessStore.actions.reportMessage(fn(error))
        );

        throw error;
      })
    );
  };
};

// --
// ---------- private

const createStartOperatorFn = (startFn: () => void) => {
  return <T>(source: Observable<T>): Observable<T> => {
    return source.pipe(
      tap(() => {
        startFn();
      })
    );
  };
};

const createStopOperatorFn = (stopFn: () => void) => {
  return <T>(source: Observable<T>): Observable<T> => {
    return source.pipe(
      tap(() => {
        stopFn();
      }),
      catchError((error: any) => {
        stopFn();

        throw error;
      })
    );
  };
};
