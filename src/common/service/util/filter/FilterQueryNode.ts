import { LangUtils } from "../LangUtils";

export abstract class FilterQueryNode {
  abstract toString(): string;
}

// tslint:disable-next-line: max-classes-per-file
export class LogicalFilterQueryNode extends FilterQueryNode {
  constructor(public operator: string) {
    super();
  }

  toString(): string {
    return this.operator;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class BooleanFilterQueryItem extends FilterQueryNode {
  constructor(public name: string, public operator: string) {
    super();
  }

  toString(): string {
    return `${this.name}${this.operator}`;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class ComparisonFilterQueryItem extends FilterQueryNode {
  constructor(
    public name: string,
    public operator: string,
    public value: OperatorValue
  ) {
    super();
  }

  toString(): string {
    let escapedValue = this.value;
    if (escapedValue != null && LangUtils.isString(escapedValue)) {
      // escape embedded quotes
      if (escapedValue.indexOf('"') !== -1) {
        escapedValue = escapedValue.replace(/"/g, '\\"');
      }

      escapedValue = `"${escapedValue}"`;
    }

    return `${this.name}${this.operator}${escapedValue}`;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class ListFilterQueryItem extends FilterQueryNode {
  constructor(
    public name: string,
    public operator: string,
    public valueList: OperatorValue[]
  ) {
    super();
  }

  toString(): string {
    const escapedValue = this.valueList
      .map((value) => {
        let tmpValue = value;
        // wrap string values in double quotes
        if (LangUtils.isString(tmpValue)) {
          // escape embedded quotes
          if (tmpValue.indexOf('"') !== -1) {
            tmpValue = tmpValue.replace(/"/g, '\\"');
          }

          tmpValue = `"${tmpValue}"`;
        }

        return tmpValue;
      })
      .join(",");

    return `${this.name}${this.operator}${FilterQueryOperator.GROUP_START}${escapedValue}${FilterQueryOperator.GROUP_END}`;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class FilterQueryOperator {
  static AND = ";";
  static OR = "|";

  static GROUP_START = "(";
  static GROUP_END = ")";

  static EQUAL = "==";
  static NOT_EQUAL = "!=";

  static LESS_THAN = "<";
  static LESS_EQUAL = "<=";
  static GREATER_EQUAL = ">=";
  static GREATER = ">";

  static IN = "=in=";
  static NOT_IN = "=out=";

  // NOTE: currently not implemented on BE
  // static EMPTY = ' isEmpty ';
  // static NOT_EMPTY = ' notEmpty ';
}

export declare type OperatorValue = string | number | boolean;
