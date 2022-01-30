import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Axios } from "axios-observable";

export interface IHttpClientRequestConfig extends AxiosRequestConfig {
  // interceptors cannot be registered through regular config so we'll add them manually
  interceptors?: {
    request?: (request: IHttpClientRequestConfig) => IHttpClientRequestConfig;
    response?: (response: IHttpClientResponse) => IHttpClientResponse;
    error?: (error: IHttpClientErrorResponse) => any;
  };
}

export interface IApiErrorResponse {
  /** HTTP response reason phrase */
  status: string;
  /** HTTP response status code */
  statusCode: number;
  /** API response message. In case of USER_EXCEPTION this is the message that can be displayed to user. */
  errorMessage: string;
  /** API response details message details. */
  errorMessageDetails: string;
  /** API response status code eg. USER_EXCEPTION */
  code: string;
  stacktrace: string;
  sourceMicroservice: string;
}
export interface IHttpClientResponse extends AxiosResponse {}
export interface IHttpClientErrorResponse
    extends AxiosError<IApiErrorResponse> {}

class HttpClient {
  static request<T = any>(
      config: IHttpClientRequestConfig
  ): any {
    return HttpClient.create(config).request(config);
  }
  static get<T = any>(
      url: string,
      config?: IHttpClientRequestConfig
  ): any {
    return HttpClient.create(config).get(url, config);
  }
  static post<T = any>(
      url: string,
      data?: any,
      config?: IHttpClientRequestConfig
  ): any {
    return HttpClient.create(config).post(url, data, config);
  }
  static put<T = any>(
      url: string,
      data?: any,
      config?: IHttpClientRequestConfig
  ): any {
    return HttpClient.create(config).put(url, data, config);
  }
  static patch<T = any>(
      url: string,
      data?: any,
      config?: IHttpClientRequestConfig
  ): any {
    return HttpClient.create(config).patch(url, data, config);
  }
  static delete<T = any>(
      url: string,
      config?: IHttpClientRequestConfig
  ): any {
    return HttpClient.create(config).delete(url, config);
  }
  static head<T = any>(
      url: string,
      config?: IHttpClientRequestConfig
  ): any {
    return HttpClient.create(config).head(url, config);
  }

  static create(config?: IHttpClientRequestConfig): Axios {
    const client = Axios.create(config || {});

    // register interceptors
    if (config?.interceptors) {
      client.interceptors.request.use(
          config.interceptors.request,
          config.interceptors.error
      );
      client.interceptors.response.use(
          config.interceptors.response,
          config.interceptors.error
      );
    }

    return client;
  }
}

export { HttpClient };
