import {
  ComparisonFilterQueryItem,
  FilterQueryNode,
  FilterQueryOperator,
  ListFilterQueryItem,
  LogicalFilterQueryNode,
  OperatorValue,
} from "./FilterQueryNode";

/** Interface describes filter query builder API. */

export interface IFilterQueryBuilder {
  /** Add logical AND operator. */
  and(node?: FilterQueryNode): IFilterQueryBuilder;
  /** Add logical OR operator. */
  or(node?: FilterQueryNode): IFilterQueryBuilder;
  /** Add node wrapped in logical group. */
  group(node: FilterQueryNode): IFilterQueryBuilder;
  /** Add node implementing "equality" comparison ie. checks if property "name"'s value is equal to "value". */
  equals(name: string, value: OperatorValue): IFilterQueryBuilder;
  /** Add node implementing "inequality" comparison ie. checks if property "name"'s value is NOT equal to "value". */
  notEquals(name: string, value: OperatorValue): IFilterQueryBuilder;
  /** Add node implementing "less then" comparison ie. checks if property "name"'s value is less than "value". */
  lessThan(name: string, value: OperatorValue): IFilterQueryBuilder;
  /** Add node implementing "less then or equal" comparison ie. checks if property "name"'s value is less or equal to "value". */
  lessEqual(name: string, value: OperatorValue): IFilterQueryBuilder;
  /** Add node implementing "greater than" comparison ie. checks if property "name"'s value is greater than "value". */
  greaterThan(name: string, value: OperatorValue): IFilterQueryBuilder;
  /** Add node implementing "greater then or equal" comparison ie. checks if property "name"'s value is greater or equal to "value". */
  greaterEqual(name: string, value: OperatorValue): IFilterQueryBuilder;
  /** Add node implementing "in" comparison ie. checks if property "name"'s value is in list "values". */
  in(name: string, value: OperatorValue[]): IFilterQueryBuilder;
  /** Add node implementing "in" comparison ie. checks if property "name"'s value is NOT in list "values". */
  notIn(name: string, value: OperatorValue[]): IFilterQueryBuilder;
  /** Add node implementing "like" comparison ie. checks if propery "name"'s value is like "value". Like is implemented on both ends of "value" eg. "%value%". */
  like(name: string, value: OperatorValue): IFilterQueryBuilder;

  hasQueue(): boolean;
  // NOTE: currently not implemented on BE
  // isEmpty(name: string): IFilterQueryBuilder;
  // notEmpty(name: string): IFilterQueryBuilder;

  /** Compose configured builder nodes and return string containing filter query.  */
  build(): string;
}

/** Filter query builder implementation. Current nodes implement RSQL syntax: https://github.com/jirutka/rsql-parser. */
export class FilterQueryBuilder implements IFilterQueryBuilder {
  /** Filter query builder factory. Creates and returns filter builder instance. */
  static create() {
    return new FilterQueryBuilder();
  }

  private queue: FilterQueryNode[] = [];

  and(node?: FilterQueryNode): IFilterQueryBuilder {
    this.queue.push(new LogicalFilterQueryNode(FilterQueryOperator.AND));
    if (node) {
      this.queue.push(node);
    }
    return this;
  }

  or(node?: FilterQueryNode): IFilterQueryBuilder {
    this.queue.push(new LogicalFilterQueryNode(FilterQueryOperator.OR));
    if (node) {
      this.queue.push(node);
    }
    return this;
  }

  group(node: FilterQueryNode): IFilterQueryBuilder {
    this.queue.push(
      new LogicalFilterQueryNode(FilterQueryOperator.GROUP_START)
    );
    this.queue.push(node);
    this.queue.push(new LogicalFilterQueryNode(FilterQueryOperator.GROUP_END));
    return this;
  }

  equals(name: string, value: OperatorValue): IFilterQueryBuilder {
    this.queue.push(
      new ComparisonFilterQueryItem(name, FilterQueryOperator.EQUAL, value)
    );
    return this;
  }

  notEquals(name: string, value: OperatorValue): IFilterQueryBuilder {
    this.queue.push(
      new ComparisonFilterQueryItem(name, FilterQueryOperator.NOT_EQUAL, value)
    );
    return this;
  }

  lessThan(name: string, value: OperatorValue): IFilterQueryBuilder {
    this.queue.push(
      new ComparisonFilterQueryItem(name, FilterQueryOperator.LESS_THAN, value)
    );
    return this;
  }

  lessEqual(name: string, value: OperatorValue): IFilterQueryBuilder {
    this.queue.push(
      new ComparisonFilterQueryItem(name, FilterQueryOperator.LESS_EQUAL, value)
    );
    return this;
  }

  greaterThan(name: string, value: OperatorValue): IFilterQueryBuilder {
    this.queue.push(
      new ComparisonFilterQueryItem(name, FilterQueryOperator.GREATER, value)
    );
    return this;
  }

  greaterEqual(name: string, value: OperatorValue): IFilterQueryBuilder {
    this.queue.push(
      new ComparisonFilterQueryItem(
        name,
        FilterQueryOperator.GREATER_EQUAL,
        value
      )
    );
    return this;
  }

  in(name: string, value: OperatorValue[]): IFilterQueryBuilder {
    this.queue.push(
      new ListFilterQueryItem(name, FilterQueryOperator.IN, value)
    );
    return this;
  }

  notIn(name: string, value: OperatorValue[]): IFilterQueryBuilder {
    this.queue.push(
      new ListFilterQueryItem(name, FilterQueryOperator.NOT_IN, value)
    );
    return this;
  }

  like(name: string, value: OperatorValue): IFilterQueryBuilder {
    this.queue.push(
      new ComparisonFilterQueryItem(
        name,
        FilterQueryOperator.EQUAL,
        "%" + value + "%"
      )
    );
    return this;
  }

  // NOTE: currently not implemented on BE
  // isEmpty(name: string): IFilterQueryBuilder {
  //   this.queue.push(new BooleanFilterQueryItem(name, FilterQueryOperator.EMPTY));
  //   return this;
  // }
  //
  // notEmpty(name: string): IFilterQueryBuilder {
  //   this.queue.push(new BooleanFilterQueryItem(name, FilterQueryOperator.NOT_EMPTY));
  //   return this;
  // }

  toString(): string {
    return this.build();
  }

  build(): string {
    return this.queue.reduce((accum: string, item: FilterQueryNode) => {
      return `${accum}${item.toString()}`;
    }, "");
  }

  queueSize() {
    return this.queue.length;
  }

  hasQueue(): boolean {
    return this.queue.length > 0;
  }
}
