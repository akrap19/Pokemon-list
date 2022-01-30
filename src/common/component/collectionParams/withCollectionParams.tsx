import React, { ReactText } from "react";
import {ICollectionFetchPayload, ICollectionSorter} from "../../service/business/common/types";
import {LangUtils} from "../../service/util/LangUtils";
import { TablePaginationConfig } from "antd/lib/table";
import { SorterResult } from "antd/lib/table/interface";

// --
// ----- Prop types

export interface IWithCollectionParamsOwnProps<F> {
  collectionParams: Readonly<IWithCollectionParamsState>;
  onUpdateList: (
    onUpdateList: (payload: ICollectionFetchPayload<F>) => void,
    filter: F,
    page?: number,
    pagesize?: number,
    sort?: ICollectionSorter[]
  ) => void;
  onListPageChange: (page?: number, pagesize?: number) => void;
  onListSortChange: (sort: ICollectionSorter[]) => void;
  onTableChange: (
    pagination: TablePaginationConfig,
    filters: Partial<Record<string, ReactText[] | null>>,
    sorter: SorterResult<any> | Array<SorterResult<any>>
  ) => void;
  overrideDefaultInitialCollectionParams: (
    page?: number,
    pagesize?: number,
    sort?: ICollectionSorter[]
  ) => void;
  canLoadMore: (listSize: number) => boolean;
}

interface IWithCollectionParamsState {
  page: number;
  pagesize: number;
  sort: ICollectionSorter[];
}

// --
// ----- Component

/** Higher order component for injecting collection params support to components. */
const withCollectionParams = <P, F extends object>(
  Component: React.ComponentType<P>
) =>
  class WithCollectionParams extends React.Component<
    Exclude<P, IWithCollectionParamsOwnProps<F>>
  > {
    state: IWithCollectionParamsState = {
      page: 0,
      pagesize: 10,
      sort: [],
    };

    render() {
      const TypedComponent: React.ComponentType<
        P & IWithCollectionParamsOwnProps<F>
      > = Component as any;
      return (
        <TypedComponent
          {...this.props}
          onUpdateList={this.updateList}
          onListPageChange={this.handlePageChange}
          onListSortChange={this.handleSortChange}
          onTableChange={this.handleTableChange}
          overrideDefaultInitialCollectionParams={
            this.overrideDefaultInitialCollectionParams
          }
          canLoadMore={this.canLoadMore}
          collectionParams={this.state}
        />
      );
    }

    isListEnd() {
      return this.state.pagesize;
    }

    private canLoadMore = (listSize: number) => {
      const currPageSize = Math.min(
        this.state.page * this.state.pagesize + this.state.pagesize,
        100
      );
      return currPageSize < 10 && currPageSize === listSize;
    };

    private updateList = (
      onUpdateList: (payload: ICollectionFetchPayload<F>) => void,
      filter: F,
      page: number = this.state.page,
      pagesize: number = this.state.pagesize,
      sort: ICollectionSorter[] = this.state.sort
    ) => {
      // current implementation always fetches items starting to 0 with ever increasing page (until max page size is reached)
      const currentPage = 0;
      const currentPagesize = Math.min(
        page * pagesize + pagesize,
        100
      );

      onUpdateList({
        filter,
        page: currentPage,
        pagesize: currentPagesize,
        sort,
      });
    };

    /** Handle changes in collection paging. */
    private handlePageChange = (
      page: number = this.state.page + 1,
      pagesize: number = this.state.pagesize
    ) => {
      // TODO: define loadMore paging, and after that inputs to this function
      this.setState({
        page,
        pagesize,
      });
    };

    /** Handle changes in collection sorting. */
    private handleSortChange = (sort: ICollectionSorter[]) => {
      this.setState({
        sort,
      });
    };

    /** Method for handling specific changes specific to collections displayed using ant's Table. */
    private handleTableChange = (
      pagination: TablePaginationConfig,
      filters: Partial<Record<string, ReactText[] | null>>,
      sorter: SorterResult<any> | Array<SorterResult<any>>
    ) => {
      if (!LangUtils.isArray(sorter)) {
        if (sorter.order != null && sorter.columnKey != null) {
          this.handleSortChange([
            { field: sorter.columnKey.toString(), direction: sorter.order },
          ]);
        } else {
          this.handleSortChange([]);
        }
      } else if (LangUtils.isArray(sorter)) {
        const sortArray: ICollectionSorter[] = [];
        sorter.forEach((sort) => {
          if (sort.columnKey != null && sort.order != null) {
            sortArray.push({
              field: sort.columnKey?.toString(),
              direction: sort.order,
            });
          }
        });
        this.handleSortChange(sortArray);
      }
    };

    private overrideDefaultInitialCollectionParams = (
      page: number = this.state.page,
      pagesize: number = this.state.pagesize,
      sort?: ICollectionSorter[]
    ) => {
      this.setState({
        page,
        pagesize,
        sort,
      });
    };
  };

// ----- exports
export default withCollectionParams;
