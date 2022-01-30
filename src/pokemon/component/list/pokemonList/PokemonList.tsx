import { Table } from "antd";
import { ColumnProps, TablePaginationConfig } from "antd/lib/table";
import React, { ReactText } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { SorterResult } from "antd/lib/table/interface";
import { OptionalValue } from "../../../../common/service/util/lang/type";
import { IPokemonListItem } from "../../../model/pokemonList/PokemonListItem";

// -- Prop types
// ----------

export interface IPokemonListOwnProps {
  pokemonList: OptionalValue<IPokemonListItem[]>;
  onRowClick?: (pokemon: IPokemonListItem) => void;
}
type IPokemonListProps = IPokemonListOwnProps & RouteComponentProps;

// -- Component
// ----------

/** Pokemon list view */
function PokemonList<T>(props: IPokemonListProps) {
  const columns: Array<ColumnProps<IPokemonListItem>> = [
    {
      title: "#",
      key: "#",
      width: "25%",
      render: (record: IPokemonListItem) => {
        const urlSubstring = record.url.substring(
          1,
          record.url.lastIndexOf("/")
        );
        return urlSubstring.substring(urlSubstring.lastIndexOf("/") + 1);
      },
    },
    {
      title: "Name",
      key: "name",
      width: "25%",
      render: (record: IPokemonListItem) => {
        return record.name;
      },
    },
  ];

  if (props.pokemonList) {
    // TODO: define fake content when list is still not feched
    return (
      <Table
        columns={columns}
        dataSource={props.pokemonList}
        onRow={(record: IPokemonListItem) => ({
          onClick: () => {
            if (props.onRowClick) {
              props.onRowClick(record);
            }
          },
        })}
        locale={{
          emptyText: "nema ništa",
        }}
        pagination={false}
      />
    );
  } else {
    return <div className="text-center">{"de nada"}</div>;
  }
}

export default withRouter(PokemonList) as any;
