import React from "react";
import { Route, RouteComponentProps, RouteProps } from "react-router-dom";
import PcError from "../../service/PcError";
import { RequiredBy } from "../../service/util/lang/type";

export interface IRouteWithLayoutOwnProps
  extends RequiredBy<RouteProps, "component"> {
  /** Component layout component. */
  layout?: React.ComponentType<any>;
  /** Function for rendering page children. */
  renderChildren?: (props: RouteComponentProps) => React.ReactNode;
}

/** Router route wrapper providing declarative way of rendering layout, page and page children. */
export const AppRoute: React.SFC<IRouteWithLayoutOwnProps> = ({
  layout: Layout,
  component: TargetComponent,
  renderChildren,
  ...routeProps
}) => {
  // something to wrap our component into
  const Wrapper = Layout ?? React.Fragment;

  if (TargetComponent == null) {
    throw new PcError(
      "App route has an empty target route. This route renders nothing."
    );
  }

  return (
    <Route
      {...routeProps}
      render={(props) => (
        <Wrapper>
          {TargetComponent && <TargetComponent {...props} />}

          {renderChildren && renderChildren(props)}
        </Wrapper>
      )}
    />
  );
};
