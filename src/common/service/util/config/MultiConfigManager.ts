import { IConfigValueContainer } from "./ConfigValueContainer";
import { ConfigUtils } from "./ConfigUtils";
import PcError from "../../PcError";
import { ConfigManagerValueNotFoundException } from "./ConfigManagerValueNotFoundException";

/**
 * Config manager provides easy way to extract values at arbitrary path in config object. Multi config manager handles multiple configs.
 * It searches iteratively through configs until it finds the first non-undefined value and returns it. Or returns undefined if no value has been found
 *
 *
 * Multi config manager does not support "setValue()" method because there are multiple configs (throws exception)
 * and it's unclear in which to set value.
 */

export default class MultiConfigManager<T> {
  constructor(
    private nameProp: string,
    private configsProp: Array<IConfigValueContainer<T>>
  ) {}

  name() {
    return `Multi config manager [${this.nameProp}]`;
  }

  toString() {
    return this.name();
  }

  /** Return value found under selector path. Path is a string of property names concatenated with ".", eg. "prop1.prop2.prop3". */
  getValue<R>(selector: string, required: boolean = false): R | undefined {
    const entry: R | undefined = this.reduceStateValue(selector);

    if (entry === undefined && required) {
      throw new ConfigManagerValueNotFoundException(selector, this.name());
    }

    return entry;
  }

  /**
   * Set value on object under selector path. Path is a string of property names concatenated with ".", eg. "prop1.prop2.prop3".
   * Last property name is used as a target property for given value.
   */
  setValue(
    targetSelector: string,
    name: string,
    value: any,
    overwrite: boolean = true
  ): void {
    throw new PcError(
      "Multi config manager does not support setting values. Multiple configs, remember? ;-)"
    );
  }

  private reduceStateValue(selector: string) {
    return this.configsProp.reduce((accum, config) => {
      return accum !== undefined
        ? accum
        : ConfigUtils.reducePath(config.value(), selector);
    }, undefined);
  }
}
