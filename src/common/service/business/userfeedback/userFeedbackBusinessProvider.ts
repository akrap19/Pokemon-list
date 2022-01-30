import { Observable, of } from "rxjs";
import { catchError, delay, filter, map, mergeMap, tap } from "rxjs/operators";
import { getLogger } from "../../util/logging/logger";
import { IIdPayload, IPayloadAction } from "../common/types";
import { LangUtils } from "../../util/LangUtils";
import {
  IUserFeedbackMessage,
  IUserFeedbackMessagePayload,
  IUserFeedbackProgressStatus,
  IUserFeedbackProgressStatusPayload,
} from "./types";
import {dispatchAction} from "../../util/observable/dispatchAction";

const LOGGER = getLogger("userFeedbackBusinessProvider");

// internal message counter - used to generate unique IDs if none is given
let APP_MESSAGE_COUNTER = 0;
// internal global progress status ID
const GlobalUserFeedbackProgressMonitor =
  "Global@Common_UserFeedbackProgressMonitor";

// --
// -------------------- Selectors

/** Return list of reported messages. */
const getMessages = (store: any): IUserFeedbackMessage[] =>
  store.userFeedbackMessages;

/** Return progress status for given progress ID. */
const getProgressStatus = (
  store: any,
  id: string
): IUserFeedbackProgressStatus =>
  store.userFeedbackProgressStatus && store.userFeedbackProgressStatus[id];
/** Return global progress status. */
const getGlobalProgressStatus = (store: any): IUserFeedbackProgressStatus =>
  store.userFeedbackProgressStatus &&
  store.userFeedbackProgressStatus[GlobalUserFeedbackProgressMonitor];

// -
// -------------------- Actions

const Actions = {
  USER_FEEDBACK_REPORT_MESSAGE: "USER_FEEDBACK_REPORT_MESSAGE",
  USER_FEEDBACK_STORE_MESSAGE: "USER_FEEDBACK_STORE_MESSAGE",
  USER_FEEDBACK_REMOVE_MESSAGE: "USER_FEEDBACK_REMOVE_MESSAGE",

  USER_FEEDBACK_PROGRESS_STATUS: "USER_FEEDBACK_PROGRESS_STATUS",
};

/** Report user message and send it to feedback display. This action can trigger message side-effects like: autoremove, auto ID generation, ...  */
const reportMessage = (
  msg: IUserFeedbackMessagePayload
): IPayloadAction<IUserFeedbackMessagePayload> => {
  return {
    type: Actions.USER_FEEDBACK_REPORT_MESSAGE,
    payload: { ...msg },
  };
};

/** Store message in store and end it to feedback display. This action does not handle message side-effects. Use "reportMessage" action for normal usage. */
const storeMessage = (
  msg: IUserFeedbackMessagePayload
): IPayloadAction<IUserFeedbackMessagePayload> => {
  return {
    type: Actions.USER_FEEDBACK_STORE_MESSAGE,
    payload: msg,
  };
};

/** Remove message from store and remove it or prevent it from displaying. */
const removeMessage = (id: string): IPayloadAction<IIdPayload> => {
  return {
    type: Actions.USER_FEEDBACK_REMOVE_MESSAGE,
    payload: {
      id,
    },
  };
};

/**
 * Start monitoring progress. Progress must be given a name/id in order to allow multiple concurrent progresses.
 * Multiple calls with the same id will accumulate and will require equal ammount of "stops".
 */
const startProgress = (
  id: string
): IPayloadAction<IUserFeedbackProgressStatusPayload> => {
  return {
    type: Actions.USER_FEEDBACK_PROGRESS_STATUS,
    payload: { id, update: 1 },
  };
};

/**
 * Stop monitoring progress with given name/id.
 * Multiple calls with the same id will decrement accumulated "start" calls.
 */
const stopProgress = (
  id: string
): IPayloadAction<IUserFeedbackProgressStatusPayload> => {
  return {
    type: Actions.USER_FEEDBACK_PROGRESS_STATUS,
    payload: { id, update: -1 },
  };
};

/** Reset progress with given name/id. Stops progress regardless of accumulated "starts". */
const disableProgress = (
  id: string
): IPayloadAction<IUserFeedbackProgressStatusPayload> => {
  return {
    type: Actions.USER_FEEDBACK_PROGRESS_STATUS,
    payload: { id, status: 0 },
  };
};

/** Alias for starting progress with global name/id. */
const startGlobalProgress =
  (): IPayloadAction<IUserFeedbackProgressStatusPayload> => {
    return startProgress(GlobalUserFeedbackProgressMonitor);
  };

/** Alias for stopping progress with global name/id. */
const stopGlobalProgress =
  (): IPayloadAction<IUserFeedbackProgressStatusPayload> => {
    return stopProgress(GlobalUserFeedbackProgressMonitor);
  };

/** Alias for disabling progress with global name/id. */
const disableGlobalProgress =
  (): IPayloadAction<IUserFeedbackProgressStatusPayload> => {
    return disableProgress(GlobalUserFeedbackProgressMonitor);
  };

// -
// -------------------- Side-effects

const reportUserFeedbackMessageEffect = (
  action$: Observable<IPayloadAction<IUserFeedbackMessagePayload>>,
  state$: Observable<any>
) => {
  return action$.pipe(
    filter((action) => {
      return action.type === Actions.USER_FEEDBACK_REPORT_MESSAGE;
    }),

    tap((action) => {
      const msg = action.payload;

      // force message ID
      msg.id = msg.id != null ? msg.id : (++APP_MESSAGE_COUNTER).toString();
    }),

    // prevent repeating of the same message
    dispatchAction((action) => removeMessage(action.payload.id)),

    mergeMap((action) => {
      const msg = action.payload;

      // configure message autoremove
      const actionDelay = msg.timeout != null ? msg.timeout : 4000;
      if (
        actionDelay >= 0 &&
        (LangUtils.isEmpty(msg.autoRemove) || msg.autoRemove)
      ) {
        // create delayed action pipeline
        of(msg)
          .pipe(
            delay(actionDelay),

            dispatchAction(() => {
              return removeMessage(msg.id!);
            })
          )
          .subscribe(LangUtils.noopFn);
      }

      return of(msg);
    }),

    map((msg) => {
      return storeMessage(msg);
    }),

    catchError((error: any, o: Observable<any>) => {
      LOGGER.error("Error reporting user feedback message", error);

      return o;
    })
  );
};

// -
// -------------------- Reducers

const userFeedbackMessages = (
  state: IUserFeedbackMessagePayload[] = [],
  action: IPayloadAction<IUserFeedbackMessagePayload>
) => {
  // ----- STORE MESSAGE
  if (action.type === Actions.USER_FEEDBACK_STORE_MESSAGE) {
    return [...state, action.payload];
  }
  // ----- Remove message
  else if (action.type === Actions.USER_FEEDBACK_REMOVE_MESSAGE) {
    const messageId = action.payload.id;
    const msgIndex = state.reduce((accum, curr, idx) => {
      if (accum !== -1) {
        return accum;
      }

      return curr.id === messageId ? idx : -1;
    }, -1);

    if (msgIndex !== -1) {
      return [...state.slice(0, msgIndex), ...state.slice(msgIndex + 1)];
    }
  }

  return state;
};

const userFeedbackProgressStatus = (
  state: { [id: string]: IUserFeedbackProgressStatus } = {},
  action: IPayloadAction<IUserFeedbackProgressStatusPayload>
) => {
  const payload: IUserFeedbackProgressStatusPayload = action.payload;

  if (action.type === Actions.USER_FEEDBACK_PROGRESS_STATUS) {
    // get current status or create a new one
    let currentProgressStatus = state[payload.id];
    if (state[payload.id] == null) {
      currentProgressStatus = { id: payload.id, status: 0 };
    }

    // set status
    if (payload.status) {
      currentProgressStatus.status = payload.status;
    }
    // update status
    else if (payload.update) {
      currentProgressStatus.status =
        (currentProgressStatus.status || 0) + payload.update;
      if (currentProgressStatus.status < 0) {
        currentProgressStatus.status = 0;
      }
    }

    return {
      ...state,
      [payload.id]: { id: payload.id, status: currentProgressStatus.status },
    };
  }

  // NOOP
  return state;
};

// --
// ----- Store object

const UserFeedbackBusinessStore = {
  actions: {
    reportMessage,
    storeMessage,
    removeMessage,
    startProgress,
    stopProgress,
    disableProgress,
    startGlobalProgress,
    stopGlobalProgress,
    disableGlobalProgress,
  },

  selectors: {
    getMessages,
    getProgressStatus,
    getGlobalProgressStatus,
  },

  effects: {
    reportUserFeedbackMessageEffect,
  },

  reducers: {
    userFeedbackMessages,
    userFeedbackProgressStatus,
  },
};

// --
// ----- Exports

export default UserFeedbackBusinessStore;
