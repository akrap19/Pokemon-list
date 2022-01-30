import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  HttpClient,
  IHttpClientRequestConfig,
  IHttpClientResponse,
} from "./HttpClient";
import { IApiCollectionResponse } from "./types";
import { resolveMultiple } from "../../registry/dependencyRegistry";
import {
  API_REQUEST_INTERCEPTORS_REGISTRY_KEY,
  API_RESPONSE_ERROR_INTERCEPTORS_REGISTRY_KEY,
  API_RESPONSE_INTERCEPTORS_REGISTRY_KEY,
  ApiRequestInterceptor,
  ApiResponseErrorInterceptor,
  ApiResponseInterceptor,
} from "./apiInterceptors";

export type IEntityApiUrlPart = string | number;
export type IEntityApiBody = Record<IEntityApiUrlPart, any>;

export default class EntityApiServiceBuilder {
  static create(): EntityApiServiceBuilder {
    return new EntityApiServiceBuilder();
  }

  /** Holds (private) URL parts from which URL is contructed */
  private parts: IEntityApiUrlPart[] = [];

  // ---------- URL parts APIa

  /** Add url resource prefix. Usually it is used to group a group of endpoints. eg. /resources/... */
  parentResource(prefix: IEntityApiUrlPart): EntityApiServiceBuilder {
    this.parts.push(prefix);

    return this;
  }

  /** Add entity URL prefix. Usually this is used to add parent entity to URL. Eg. /service/<ID>/... */
  parentEntity(
    name: IEntityApiUrlPart,
    id: IEntityApiUrlPart
  ): EntityApiServiceBuilder {
    this.parts.push(name.toString());
    this.parts.push(id);

    return this;
  }

  /** Add method URL prefix. Sometimes, URL's have a method or "something that's not parent entity". This can be an action name or object name, ... Eg. /auth/current-user/... */
  parentMethod(method: IEntityApiUrlPart): EntityApiServiceBuilder {
    this.parts.push(method);

    return this;
  }

  // ---------- Entity API

  /** Fetch entity with name&ID from API. */
  fetchEntity<E>(
    name: IEntityApiUrlPart,
    id: string,
    params?: IEntityApiBody
  ): Observable<E> {
    this.parentEntity(name, id);

    return HttpClient.get(
      this.serializeUrlParts(),
      this.callApiRequestInterceptors({ params })
    ).pipe(
      map(this.callApiResponseInterceptors),

      // check errors
      catchError(this.callApiResponseErrorInterceptors)
    );
  }

  /** Add entity name to URL and fetch it from API. */
  createEntity<E>(
    name: IEntityApiUrlPart,
    body: IEntityApiBody
  ): Observable<E> {
    this.parentResource(name);

    return HttpClient.post(
      this.serializeUrlParts(),
      body,
      this.callApiRequestInterceptors()
    ).pipe(
      map(this.callApiResponseInterceptors),

      // check errors
      catchError(this.callApiResponseErrorInterceptors)
    );
  }

  /** Add entity name&ID to URL and fetch it from API. */
  updateEntity<E>(
    name: IEntityApiUrlPart,
    id: IEntityApiUrlPart,
    body: IEntityApiBody
  ): Observable<E> {
    this.parentEntity(name, id);

    return HttpClient.post(
      this.serializeUrlParts(),
      body,
      this.callApiRequestInterceptors()
    ).pipe(
      map(this.callApiResponseInterceptors),

      // check errors
      catchError(this.callApiResponseErrorInterceptors)
    );
  }

  /** Add entity name&ID to URL and fetch it from API. */
  deleteEntity<E>(
    name: IEntityApiUrlPart,
    id: IEntityApiUrlPart
  ): Observable<E> {
    this.parentEntity(name, id);

    return HttpClient.delete(
      this.serializeUrlParts(),
      this.callApiRequestInterceptors()
    ).pipe(
      map(this.callApiResponseInterceptors),

      // check errors
      catchError(this.callApiResponseErrorInterceptors)
    );
  }

  // ---------- Entity list API

  fetchEntityList<E>(
    name: IEntityApiUrlPart,
    params: IEntityApiBody
  ): Observable<IApiCollectionResponse<E>> {
    this.parentResource(name);

    return HttpClient.get(
      this.serializeUrlParts(),
      this.callApiRequestInterceptors({ params })
    ).pipe(
      map(this.callApiResponseInterceptors),
      // check errors
      catchError(this.callApiResponseErrorInterceptors)
    );
  }

  // ---------- Method API

  fetchMethod<E>(
    method: IEntityApiUrlPart,
    params?: IEntityApiBody
  ): Observable<E> {
    this.parentMethod(method);

    return HttpClient.get(
      this.serializeUrlParts(),
      this.callApiRequestInterceptors({ params })
    ).pipe(
      map(this.callApiResponseInterceptors),

      // check errors
      catchError(this.callApiResponseErrorInterceptors)
    );
  }

  createMethod<E>(
    method: IEntityApiUrlPart,
    body: IEntityApiBody
  ): Observable<E> {
    this.parentMethod(method);

    return HttpClient.post(
      this.serializeUrlParts(),
      body,
      this.callApiRequestInterceptors()
    ).pipe(
      map(this.callApiResponseInterceptors),

      // check errors
      catchError(this.callApiResponseErrorInterceptors)
    );
  }

  // tslint:disable-next-line: no-identical-functions
  updateMethod<E>(
    method: IEntityApiUrlPart,
    body: IEntityApiBody
  ): Observable<E> {
    this.parentMethod(method);

    return HttpClient.post(
      this.serializeUrlParts(),
      body,
      this.callApiRequestInterceptors()
    ).pipe(
      map(this.callApiResponseInterceptors),

      // check errors
      catchError(this.callApiResponseErrorInterceptors)
    );
  }

  /** Fetch entity by URL only. Can be used for fetching static content */
  fetchByUrl<E>(url: string): Observable<IApiCollectionResponse<E>> {
    return HttpClient.get(url).pipe(
      map(this.callApiResponseInterceptors),

      // check errors
      catchError(this.callApiResponseErrorInterceptors)
    );
  }

  /** Fetch entity by URL only. Can be used for fetching static content */
  fetchByUrlWithParams<E>(
    url: string,
    params?: IEntityApiBody
  ): Observable<IApiCollectionResponse<E>> {
    return HttpClient.get(
      url,
      this.callApiRequestInterceptors({ params })
    ).pipe(
      map(this.callApiResponseInterceptors),

      // check errors
      catchError(this.callApiResponseErrorInterceptors)
    );
  }

  /*

  updateEntityMethod<E>(entity: string, id: string, method: string, body: object): Observable<E>;


  // ---------- Entity list API

  fetchEntityList<E>(entity: string, queryParams?: object): Observable<E>;

  createEntityList(entity: string, body: object): Observable<object[]>;

  deleteEntityList(entity: string, body: object[]): Observable<void>;

  // ---------- Method API

  fetchNoMethod<E>(entity: string, queryParams?: object): Observable<E>;

  updateMethod<E>(entity: string, method: string, body: object): Observable<E>;
  */

  // ---------- private

  /**
   * Process API request interceptor chain.
   */
  private callApiRequestInterceptors(
    config?: IHttpClientRequestConfig
  ): IHttpClientRequestConfig {
    // tslint:disable-next-line: no-ignored-return - we just want to process handlers until the first one fails
    return (
      resolveMultiple<ApiRequestInterceptor>(
        API_REQUEST_INTERCEPTORS_REGISTRY_KEY
      ) || []
    ).reduce((accum, interceptor) => {
      return interceptor(accum);
    }, config || {});
  }

  /**
   * Process API response interceptor chain.
   */
  private callApiResponseInterceptors(
    response: IHttpClientResponse
  ): IHttpClientResponse {
    // tslint:disable-next-line: no-ignored-return - we just want to process handlers until the first one fails
    return (
      resolveMultiple<ApiResponseInterceptor>(
        API_RESPONSE_INTERCEPTORS_REGISTRY_KEY
      ) || []
    ).reduce((accum, interceptor) => {
      return interceptor(accum);
    }, response);
  }

  /**
   * Process API response error interceptor chain.
   */
  private callApiResponseErrorInterceptors(error: any, o: Observable<any>) {
    // tslint:disable-next-line: no-ignored-return - we just want to process handlers until the first one fails
    (
      resolveMultiple<ApiResponseErrorInterceptor>(
        API_RESPONSE_ERROR_INTERCEPTORS_REGISTRY_KEY
      ) || []
    ).some((interceptor) => {
      return !interceptor(error); // we want to continue until first handler returns false
    });

    // rethrow error for further processing
    // this is partly written like this to satisfy catchError operator prototype, but also to prevent rethrowing empty errors(?)
    if (error != null) {
      throw error;
    }

    return o;
  }

  private serializeUrlParts(): string {
    return this.parts.join("/");
  }
}
