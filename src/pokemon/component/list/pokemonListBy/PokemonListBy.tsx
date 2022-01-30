import { Table } from "antd";
import { ColumnProps, TablePaginationConfig } from "antd/lib/table";
import React, { ReactText } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { SorterResult } from "antd/lib/table/interface";
import { OptionalValue } from "../../../../common/service/util/lang/type";
import { IPokemonListByItem } from "../../../model/pokemonListBy/PokemonListByItem";

// -- Prop types
// ----------

export interface IPokemonListByOwnProps {
  pokemonList: OptionalValue<IPokemonListByItem[]>;
  onTableChange: (
    pagination: TablePaginationConfig,
    filters: Partial<Record<string, ReactText[] | null>>,
    sorter: SorterResult<any> | Array<SorterResult<any>>
  ) => void;
  onRowClick?: (pokemon: IPokemonListByItem) => void;
  scrollY?: number;
}
type IPokemonListByProps = IPokemonListByOwnProps & RouteComponentProps;

interface IPokemonListByState {}

// -- Component
// ----------

/** Pokemon list view */
class PokemonListBy extends React.Component<
  IPokemonListByProps,
  IPokemonListByState
> {
  state: IPokemonListByState = {};

  columns: Array<ColumnProps<IPokemonListByItem>> = [
    {
      title: "#",
      key: "#",
      width: "25%",
      render: (record: IPokemonListByItem) => {
        const urlSubstring = record.pokemon.url.substring(
          1,
          record.pokemon.url.lastIndexOf("/")
        );
        return urlSubstring.substring(urlSubstring.lastIndexOf("/") + 1);
      },
    },
    {
      title: "Name",
      key: "name",
      width: "25%",
      render: (record: IPokemonListByItem) => {
        return record.pokemon.name;
      },
    },
  ];

  render = () => {
    if (this.props.pokemonList) {
      // TODO: define fake content when list is still not feched
      return (
        <Table
          columns={this.columns}
          dataSource={this.props.pokemonList}
          onChange={this.props.onTableChange}
          onRow={(record: IPokemonListByItem) => ({
            onClick: () => {
              if (this.props.onRowClick) {
                this.props.onRowClick(record);
              }
            },
          })}
          locale={{
            emptyText: "nema ništa",
          }}
          pagination={false}
          scroll={{ y: this.props.scrollY, x: undefined }}
        />
      );
    } else {
      return <div className="text-center">{"de nada"}</div>;
    }
  };
}

export default withRouter(PokemonListBy) as any;
