import { Globals } from "./Globals";
import { Nullable } from "./lang/type";

export class LangUtils {
  static isEmpty<T>(obj: T): obj is Nullable<T> {
    return obj == null;
  }

  static isNotEmpty<T>(obj: T): obj is NonNullable<T> {
    return !LangUtils.isEmpty(obj);
  }

  static isUndefined(obj: any): boolean {
    return obj === void 0;
  }

  static isString(obj: any): obj is string {
    return typeof obj === "string";
  }

  static isNumber(obj: any): obj is number {
    return typeof obj === "number";
  }

  static isBoolean(obj: any): obj is boolean {
    return typeof obj === "boolean";
  }

  static isArray(obj: any): obj is any[] {
    return Array.isArray(obj);
  }

  // tslint:disable-next-line:ban-types
  static isFunction(obj: any): obj is Function {
    return obj instanceof Function;
  }

  /** Returns true if valus is null/undefined or an empty string. Value is optionally trimmed before checking. */
  static isStringEmpty(
    value: string | undefined | null,
    trim: boolean = true
  ): value is undefined | null {
    return (
      LangUtils.isEmpty(value) ||
      (trim ? value.trim().length === 0 : value.length === 0)
    );
  }

  static isPrimitive(obj: any): obj is boolean | string | number {
    return (
      LangUtils.isString(obj) ||
      LangUtils.isNumber(obj) ||
      LangUtils.isBoolean(obj)
    );
  }

  static isJsObject(o: any): boolean {
    return (
      !LangUtils.isEmpty(o) &&
      (LangUtils.isFunction(o) || typeof o === "object")
    );
  }

  static isPromise(obj: any): obj is Promise<any> {
    return obj instanceof Globals.global.Promise;
  }

  static isEmptyObject<T>(obj: T): obj is Nullable<T> {
    return Object.keys(obj).length === 0;
  }

  /**
   * Compare two objects.
   *
   * @param {any} o1 first object
   * @param {any} o2 second object
   * @param {boolean} loose if true, JS's loose comparison (==) is used for equality
   *
   *
   * @returns {number} 1 if first object is greater, -1 if second object is greater, 0 otherwise
   */
  static compare(o1: any, o2: any, loose: boolean = true): number {
    // first check if they are the very same object to avoid unnecessary comparisons
    if (!loose && o1 === o2) {
      return 0;
    }
    // tslint:disable-next-line:triple-equals
    if (loose && o1 == o2) {
      return 0;
    }

    // chek if one of them is empty
    if (LangUtils.isEmpty(o1) && LangUtils.isEmpty(o2)) {
      return 0;
    }
    if (LangUtils.isEmpty(o1)) {
      return -1;
    }
    if (LangUtils.isEmpty(o2)) {
      return 1;
    }

    // equality has been cheked at the begining so what we're left with is < or >
    if (o1 < o2) {
      return -1;
    } else {
      return 1;
    }
  }

  static stringify(token: any): string {
    if (typeof token === "string") {
      return token;
    }

    if (token == null) {
      return "" + token;
    }

    // named objects
    /*if (token.name) {
      return token.name;
    }
    if (token.overriddenName) {
      return token.overriddenName;
    }*/

    const res = token.toString();
    const newLineIndex = res.indexOf("\n");

    return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
  }

  /**
   * Serialize token of any type. Method is similar to {@see LanUtils.stringify()}, but "serialize" tries
   * to preserve token original type.
   *
   * Primitives are returned as is, functions are returned as string (using toString() method)
   * and object are stringified to JSON string.
   */
  static serialize(token: any): any {
    const tokenType = typeof token;
    if (
      tokenType === "string" ||
      tokenType === "number" ||
      tokenType === "boolean" ||
      tokenType === "symbol"
    ) {
      return token;
    }

    if (token === void 0 || token === null) {
      return token;
    }

    if (tokenType === "function") {
      return token.toString();
    }

    return JSON.stringify(token);
  }

  /** Noop function. Can be used as default NOOP handler. */
  static noopFn() {
    // NOOP
  }

  /** Error function. Accepts single argument (error) and simply throws it as exception. Can be used as default error handler. */
  static errFn(e: any) {
    throw e;
  }
}
