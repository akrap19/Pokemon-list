import React from "react";
import Header from "./common/component/common/header/Header";

export default class App extends React.Component {
  render() {
    return (
      <>
        <Header />
        <div className="App">
          <div>{this.props.children}</div>
        </div>
      </>
    );
  }
}
