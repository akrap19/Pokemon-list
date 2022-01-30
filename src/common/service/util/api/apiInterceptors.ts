/**
 * Describes API request interceptor function.
 *
 * @param config {any} - config object
 * @returns {any} config object
 */
import {IHttpClientRequestConfig, IHttpClientResponse} from "./HttpClient";


export type ApiRequestInterceptor = (config: IHttpClientRequestConfig) => IHttpClientRequestConfig;

/**
 * Describes API response interceptor function.
 *
 * @param response {any} - response object
 * @returns {boolean} true if error processing should continue
 */
export type ApiResponseInterceptor = (response: IHttpClientResponse) => IHttpClientResponse;

/**
 * Describes API response error interceptor function.
 *
 * @param error {any} - error object
 * @returns {boolean} true if error processing should continue
 */
export type ApiResponseErrorInterceptor = (error: any) => boolean;

/** Registry of API request interceptors. */
export const API_REQUEST_INTERCEPTORS_REGISTRY_KEY = '@@API_REQUEST_INTERCEPTORS_REGISTRY_KEY';

/** Registry of API response interceptors. */
export const API_RESPONSE_ERROR_INTERCEPTORS_REGISTRY_KEY = '@@API_RESPONSE_ERROR_INTERCEPTORS_REGISTRY_KEY';

/** Registry of API response interceptors. */
export const API_RESPONSE_INTERCEPTORS_REGISTRY_KEY = '@@API_RESPONSE_INTERCEPTORS_REGISTRY_KEY';
