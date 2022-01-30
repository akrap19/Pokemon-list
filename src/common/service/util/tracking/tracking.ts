import { Observable, Subject } from 'rxjs';

// --
// ---------- Constants

// tracking keys are created as symbols to avoid unauthorized access and accidental serialization to JSON
const TRACK_TRACKING_KEY = Symbol.for('@@TRACK_TRACKING_KEY');
const TRACK_PARENT_KEY = Symbol.for('@@TRACK_PARENT_KEY');

// --
// ---------- Trackable creator

// trackable object type
export interface ITrackableObject<T = any> {
  [TRACK_TRACKING_KEY]: Subject<T>;
  [TRACK_PARENT_KEY]: any;

  /** Returns observable which can be used for tracking object's states (success, error, complete). */
  track: () => Observable<T>;
}

/** Enhance target object with trackable properties. */
export function createTrackableObject<T = any, S = any>(target: T, parentTarget?: S): ITrackableObject & T {
  return _objectEnhancer(target, parentTarget);
}

/** Helper for notifying target object's trackers with trackable's status. */
export const TrackingHelper = {
  /** Notify trackables of successfull tracking. */
  success: <S>(target: any, data: S) => {
    if (target[TRACK_TRACKING_KEY] != null) {
      const trackTarget = target as ITrackableObject;
      const trackSubject = trackTarget[TRACK_TRACKING_KEY];
      trackSubject.next(data);

      // notify tracking parents
      const trackableParent = trackTarget[TRACK_PARENT_KEY];
      if (trackableParent != null) {
        TrackingHelper.success(trackableParent, data);
      }

      // autocomplete ... for now
      trackSubject.complete();
    }
  },

  /** Notify trackables of tracking error. */
  error: <S>(target: any, error: S) => {
    // force any to allow cheking for T_A_KEY on possibly non-track target
    if (target[TRACK_TRACKING_KEY] != null) {
      const trackTarget = target as ITrackableObject;
      const trackSubject = trackTarget[TRACK_TRACKING_KEY];
      trackSubject.error(error);
      // erorrs are autocompleted by default

      // notify tracking parents
      const trackableParent = trackTarget[TRACK_PARENT_KEY];
      if (trackableParent != null) {
        TrackingHelper.error(trackableParent, error);
      }
    }
  },
};

// ---------- private

/** Enhance target object with tracking properties. */
function _objectEnhancer<T, S = any>(target: T, parent?: S): ITrackableObject & T {
  // if object is already trackable, just return it
  // force "any" to allow cheking for abitrary property
  if ((target as any)[TRACK_TRACKING_KEY] != null) {
    return target as ITrackableObject & T;
  }

  const trackTarget: ITrackableObject & T = Object.assign(
    // target object
    target,

    // tracking properties target is enhanced with
    {
      [TRACK_TRACKING_KEY]: new Subject(), // use plain subject that sends only sent values without saving/remembering previous values

      [TRACK_PARENT_KEY]: parent,

      track: () => {
        return trackTarget[TRACK_TRACKING_KEY].asObservable();
      },
    } as ITrackableObject
  );

  return trackTarget;
}
