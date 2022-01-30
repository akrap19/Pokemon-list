/** Used for wrapping different value sources under the same interface. */
export interface IConfigValueContainer<T> {
  value(): T;
}

/** Default impl of config value container. This impl simply holds and returns given value. */
export class DefaultConfigValueContainer<T> implements IConfigValueContainer<T> {
  constructor(private state: T) {}

  value(): T {
    return this.state;
  }
}
