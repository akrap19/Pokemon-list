/**
 * Make certain type's properties optional.
 *
 * Example:
 * ```ts
 * interface A { a: number, b: number, c: number }
 *
 * type B = PartialBy<A, 'b' | 'c'>; // creates type B with all A's props except 'b' and 'c' are now optional
 * ```
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make certain type's properties required.
 *
 * Example:
 * ```ts
 * interface A { a: number, b?: number, c?: number }
 *
 * type B = RequiredBy<A, 'b'>; // creates type B with 'a' and 'b' property required and 'c' property remains optional
 * ```
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Create new type by replacing type of certain properties.
 *
 * Example:
 * ```ts
 * interface Status { id: number; description: string; }
 * interface IdObj { id: number; }
 * interface A { a: number, b: { id: number, description: string }, c: { id: number, description: string } }
 *
 * type B = ReplaceBy<A, 'b' | 'c', IdObj>; // creates type B with all A's props except 'b' and 'c' are now of type IdObj
 * ```
 */
export type ReplaceBy<T, K extends keyof T, R> = Omit<T, K> & Record<K, R>;

/**
 * Optional type. Makes value of given type also both undefined and nullable.
 * Can be used for optional object properties but, unlike TS's integrated type "Partial", this can be used directly on object's property definitions.
 *
 * Example:
 * ```ts
 * class A {
 *   prop1: OptionalValue<string>;
 * }
 * ```
 *
 * is the same as
 * ```ts
 * class A {
 *   prop1: string | null | undefined;
 * }
 * ```
 */
export type OptionalValue<T> = T | undefined | null;

/**
 * Counter type to TS's integrated NonNullable. Obviously, it forces type to be null | undefined.
 * Can be used for TS type guards to fistinguish between empty and non empty values.
 *
 * Example:
 * ```ts
 * function isEmpty<T>(value: T): value is Nullable<T> {
 *   return value == null;
 * }
 *
 * let value1: string | null | undefined;
 * if (isEmpty(value1)) {
 *   let value2 = value1; // value1 is ALWAYS null | undefined
 * } else {
 *   let value2 = value1; // value1 is NEVER null | undefined
 * }
 *
 * ```
 */
export type Nullable<T> = T extends null | undefined ? T : never;
