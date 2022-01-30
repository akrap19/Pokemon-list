import PcError from "../PcError";
import { IApiErrorResponse } from "../util/api/HttpClient";

/** API service error codes enumeration. */
export enum ApiResponseErrorCode {
  // common
  SESSION_EXPIRED = "SESSION_EXPIRED",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  // session
  ALREADY_ACCEPTED_TUTORING_SESSION_IN_THE_SAME_PERIOD = "ALREADY_ACCEPTED_TUTORING_SESSION_IN_THE_SAME_PERIOD",
  // tutor profile calendar
  TIME_PERIODS_IN_THE_SAME_DAY_COLLIDING = "TIME_PERIODS_IN_THE_SAME_DAY_COLLIDING",
  // tutor profile details does not exist
  TUTOR_DETAILS_NOT_FOUND = "TUTOR_DETAILS_NOT_FOUND",
  // invalid old pasword on password change
  BAD_CREDENTIALS = "BAD_CREDENTIALS",
  // user exception
  USER_EXCEPTION = "USER_EXCEPTION",
}

/** Thrown when API call returns error reponse. */
export default class ApiResponseErrorException extends PcError {
  constructor(
    public readonly code: string,
    message: string,
    public details: IApiErrorResponse
  ) {
    super(
      `API responded with error '${code}' ${
        message != null ? ": " + message : ""
      }`
    );
  }
}
