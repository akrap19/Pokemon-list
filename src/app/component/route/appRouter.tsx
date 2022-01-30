import { BrowserRouter, Switch } from "react-router-dom";
import React from "react";
import { AppRoute } from "../../../common/component/route/AppRoute";
import PokemonListPage from "../page/PokemonListPage";
import PokemonViewPage from "../page/PokemonViewPage";

const appRouter = (
  <BrowserRouter>
    <Switch>
      <AppRoute path="/pokemon/:name" component={PokemonViewPage} />
      <AppRoute path="/" component={PokemonListPage} />
    </Switch>
  </BrowserRouter>
);

export default appRouter;
