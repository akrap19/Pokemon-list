// ----- API responses

/**
 * Type interface for collection data response.
 */
export interface IApiCollectionResponse<T> extends Array<T> {}

/** Error API response interface; */
export interface IErrorApiResponse {
  errorMessage: string;
  errorCode: string;
}
