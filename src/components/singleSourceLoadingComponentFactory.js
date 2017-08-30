import React, { Component } from "react";

export function singleSourceLoadingComponentFactory(configResolverInstance) {
  class SingleSourceLoadingComponent extends Component {
    constructor(props) {
      super(props);
    }

    componentWillMount() {
      this.props.onReady(configResolverInstance);
    }

    render() {
      return (
        <div className="container">
          <h1>Loading</h1>
        </div>
      );
    }
  }

  return SingleSourceLoadingComponent;
}
