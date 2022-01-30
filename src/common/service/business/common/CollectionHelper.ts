import { LangUtils } from "../../util/LangUtils";
import { ICollectionSorter } from "./types";
import {
  FilterQueryBuilder,
  IFilterQueryBuilder,
} from "../../util/filter/FilterQueryBuilder";
import { OperatorValue } from "../../util/filter/FilterQueryNode";

/**
 * Mapper iteration callback which allows caller to override mapping for certain properties.
 * Caller should return true if it has processed filter property or false if not and mapper should do it.
 */

export type ListFilterBuilderCallbackFn<T, P> = (
  builder: IFilterQueryBuilder,
  name: P,
  filter: T
) => boolean;

// declare filter type because typescript complains that "keyof T" cannot be assing to string?! Like we can use anything else than string as an object prop!?
interface IFilterType {
  [key: string]: any;
}

/** Collection of static helper methods to assist in converitng list filter objects to query filter expression. */
export default class CollectionHelper {
  /**
   * Simple list filter to API mapper with lots of defaults tipical for normal forms. All filter properties are compared using "==" operator and glued together using AND operator.
   *
   * It is possible to override that behaviour by defining callback handler function for desired props. Callback fn recieves query builder, prop name and value and can add property to builder in some other way. Or not at all.
   */
  // tslint:disable-next-line: cognitive-complexity - remove when this method is refactored
  static simpleFilterToApiMapper<T extends IFilterType>(
    filter: T,
    callback?: ListFilterBuilderCallbackFn<T, keyof T>
  ): string {
    // ----- build filter
    const queryBuilder = FilterQueryBuilder.create();

    let previousQueueSize = 0;

    // Object.keys(filter).forEach((propName: string) => {
    Object.keys(filter).forEach((propName) => {
      const propValue = filter[propName] as OperatorValue;

      // first try with callback
      const valueProcessed =
        callback && callback(queryBuilder, propName, filter);

      // let callback handler to do the job
      if (!valueProcessed) {
        let queryValue: OperatorValue;
        // ignore empty values
        if (LangUtils.isEmpty(propValue)) {
          return;
        }
        // oh, primitives, nice
        else if (LangUtils.isPrimitive(propValue)) {
          // check strings for whitespace, very common in form submitting
          if (LangUtils.isString(propValue)) {
            queryValue = propValue.trim();
            // ignore empty strings
            if (queryValue === "") {
              return;
            }
          }
          // number or boolean
          else {
            queryValue = propValue;
          }
        }
        // we can't handle non-primitives - stringify them
        else {
          queryValue = LangUtils.stringify(propValue);
        }

        // add logical operator if we have anything before
        if (queryBuilder.queueSize() !== previousQueueSize) {
          queryBuilder.and();

          previousQueueSize = queryBuilder.queueSize();
        }

        // defaults to "EQUAL" operator
        queryBuilder.equals(propName, queryValue);
      }
    });

    return queryBuilder.build();
  }

  /** Serialize collection sort array to API string */
  static sorterApiMapper(sorter: ICollectionSorter[]): string | undefined {
    return (
      sorter
        .map(
          (sort) =>
            `${sort.field}:${sort.direction === "ascend" ? "ASC" : "DESC"}`
        )
        .join(";") || undefined
    );
  }

  static isFilterInUse(values: any): boolean {
    if (LangUtils.isArray(values)) {
      return values.some((val) => !LangUtils.isStringEmpty(val));
    } else if (LangUtils.isJsObject(values)) {
      return Object.keys(values).some((val) => {
        if (values[val] && LangUtils.isString(values[val])) {
          return !LangUtils.isStringEmpty(values[val]);
        } else if (values[val]) {
          return !LangUtils.isEmptyObject(values[val].id);
        }
        return;
      });
    }
    return values != null;
  }
}
