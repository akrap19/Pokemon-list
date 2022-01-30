// --
// ---------- User Feedback

export enum UserFeedbackMessageSeverity {
  SUCCESS,
  INFO,
  WARNING,
  ERROR,
}

export enum UserFeedbackMessageType {
  /** Feedback message displayed to user as a popup message. */
  // TODO: rename USER -> MESSAGE
  USER,
  /** Feedback message displayed to user using system notification mechanism. */
  NOTIFICATION,
}

/** Describes action payload for reporting user feedback message. */
export interface IUserFeedbackMessagePayload<P = any> {
  id?: string;
  severity: UserFeedbackMessageSeverity;
  type: UserFeedbackMessageType;
  message: string;
  data?: P;
  timeout?: number;
  autoRemove?: boolean;
}

/** Describes data structure for for storing user feedback message. */
export interface IUserFeedbackMessage<P = any> {
  id: string;
  severity: UserFeedbackMessageSeverity;
  type: UserFeedbackMessageType;
  message: string;
  data?: P;
}

/** Describes action data structure for changing stored status. */
export interface IUserFeedbackProgressStatusPayload {
  id: string;
  status?: number;
  update?: number;
}

/** Describes data structure for storing progress status. */
export interface IUserFeedbackProgressStatus {
  id: string;
  status: number;
}
