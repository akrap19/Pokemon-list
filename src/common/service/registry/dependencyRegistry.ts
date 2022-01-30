/**
 * Simple dependency registry, basically, a map that can store values under some name.
 * It's purpose is to allow decoupled service configuration (eg. in an aoo) from it's implemementation (eg. in some module).
 *
 * Configurator uses "register" function to registered config values, and implementator uses "resolve" function to retrieve them and initialize itself using them.
 */
import { LangUtils } from "../util/LangUtils";

// private registry
const REGISTRY: Record<string, any[]> = {};

/**
 * Register value under given name. All values are stored in arrays to allow multiple registration under the same name.
 *
 * @param name {string} - registration name
 * @param value {T[] | T} - registered value - if it's an array, array will be unwrapped and values will be pushed to registry array
 *
 * @returns {number} number of values registered under given name
 */
export function register<T>(
  name: string,
  value: T[] | T,
  multiple: boolean = true
): number {
  if (REGISTRY[name] == null) {
    REGISTRY[name] = [];
  }

  const arrValue = LangUtils.isArray(value) ? value : [value];

  if (multiple) {
    REGISTRY[name].push(...arrValue);
  } else {
    REGISTRY[name].length = 0;
    REGISTRY[name].push(...arrValue);
  }

  return REGISTRY[name].length;
}

/**
 * Resolve and return value(s) registered under given name.
 *
 * @param name {string} - registration name
 * @param multiple {boolean} - should an entire array of values be returned or just the first/only value
 *
 * @returns {T | undefined} - if found, returns registered value, if no value has been registered under given name, undefined is returned
 */
export function resolve<T>(name: string): T | undefined {
  if (REGISTRY[name] == null) {
    return;
  }

  return REGISTRY[name].slice(0, 1).shift();
}

/**
 * Resolve and return value(s) registered under given name.
 *
 * @param name {string} - registration name
 * @param multiple {boolean} - should an entire array of values be returned or just the first/only value
 *
 * @returns {T[] | undefined} - if found, returns an array of registered  values, if no value has been registered under given name, undefined is returned
 */
export function resolveMultiple<T>(name: string): T[] | undefined {
  if (REGISTRY[name] == null) {
    return;
  }

  return REGISTRY[name].slice();
}
