/** Static UserFeedback user error creator. Simply translates static message key and returns user feedback error object. */
import {
  IUserFeedbackMessagePayload,
  UserFeedbackMessageSeverity,
  UserFeedbackMessageType,
} from "./types";
import { LangUtils } from "../../util/LangUtils";
import ApiResponseErrorException, {ApiResponseErrorCode} from "../../api/ApiResponseErrorException";

export function createStaticMessageUserFeedbackError(
  messageKey: string
): IUserFeedbackMessagePayload {
  return createUserFeedback(
    [() => mapKeyToMessage(messageKey)],
    UserFeedbackMessageSeverity.ERROR,
    UserFeedbackMessageType.USER
  );
}

/** Standard API response error creator. Tries to map API response code to message, first using provided key prefix or translation map, then using default prefix and finaly fallbacks to static message mapper. */
export function createApiResponseUserFeedbackError(
  error: any,
  translationKeyMap: string | { [key: string]: string } | undefined,
  fallbackMessageKey: string
): IUserFeedbackMessagePayload {
  return createUserFeedback(
    [
      () => mapApiResponseCodeToMessage(error, translationKeyMap),
      () =>
        mapApiResponseCodeToMessage(error, API_RESPONSE_ERROR_MESSAGE_PREFIX),
      () => mapKeyToMessage(fallbackMessageKey),
    ],
    UserFeedbackMessageSeverity.ERROR,
    UserFeedbackMessageType.USER
  );
}

/** Generic UserFeedback object creator. Takes a list of message mapper functions and returns user feedback object with mapped message and given severity/type. */
export function createUserFeedback(
  mappers: IValueMapper[],
  severity: UserFeedbackMessageSeverity,
  type: UserFeedbackMessageType
): IUserFeedbackMessagePayload {
  const message: string = valueMapper(mappers) || "<unknown error>";

  return {
    severity,
    type,
    message,
  };
}

// ----- Static message mapper

/** Translates given key and returns message. No special mapping. Can be used for static or fallback messages. */
export function mapKeyToMessage(messageKey: string): string {
  return messageKey;
}

// ----- Map API response errors

const API_RESPONSE_ERROR_MESSAGE_PREFIX = "API_RESPONSE_ERROR";

/** Maps API response error code to message using provided code-key translation map. Returns null if message is missing. */
/*export function mapApiResponseCodeToMessage(error: ApiResponseErrorException, codeToKeyMap: { [code: string]: string }): string | null {
  let message = null;

  if ((error instanceof ApiResponseErrorException)) {
    if (codeToKeyMap != null && codeToKeyMap[error.code] != null) {
      if (LocalizeService.hasTranslation(codeToKeyMap[error.code])) {
        message = LocalizeService.translate(codeToKeyMap[error.code]);
      }
    }
  }

  return message;
}*/

/** Maps API response error code to default API response message by prefixing code with default key prefix. Returns null if message is missing. */
export function mapApiResponseCodeToMessage(
  error: ApiResponseErrorException,
  translationKeyMap: string | { [key: string]: string } | undefined
): string | null {
  let message = null;

  if (error instanceof ApiResponseErrorException) {
    // user exception message from API
    if (error.code === ApiResponseErrorCode.USER_EXCEPTION && error.details) {
      message = error.details.errorMessage;
    }

    // if there is no user exception message and we have translation map, let's try with that
    if (message == null && translationKeyMap != null) {
      message = translateMessageKey(error, translationKeyMap);
    }
  }

  return message;
}

// -------------------- private

/** Describes value mapper function prototype. */
type IValueMapper = (...args: any[]) => any | null;

/** Function takes an array of mapper functions and returns return value of the first function that return non-null value. */
function valueMapper<T>(mappers: IValueMapper[]): T | null {
  return mappers.reduce((value, mapper) => {
    return value == null ? mapper() : value;
  }, null);
}

/** Try to find message in translation key map. */
function translateMessageKey(
  error: ApiResponseErrorException,
  translationKeyMap: string | { [key: string]: string }
): string | null {
  let message = null;

  return message;
}
