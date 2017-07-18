import React, { Component } from "react";
import PropTypes from "prop-types";

class DefaultLoadingScreen extends Component {
  render() {
    return (
      <div className="container">
        <h1>Loading</h1>
      </div>
    );
  }
}

class DefaultErrorScreen extends Component {
  render() {
    return (
      <div className="container">
        <h1>Error</h1>
        {this.props.error}
      </div>
    );
  }
}

export default function withManager(
  FormComponent,
  LoadingScreen = DefaultLoadingScreen,
  ErrorScreen = DefaultErrorScreen
) {
  class FormWithManager extends Component {
    constructor(props) {
      super(props);

      this.state = { isLoading: true, isError: false };
    }

    componentDidMount() {
      this.resolveConfig(this.props.configResolver);
    }

    resolveConfig = configResolver => {
      this.setState({ isLoading: true, isError: false });
      configResolver
        .resolve()
        .then(config => {
          this.setState({ config });
          this.setState({ isLoading: false, isEqual: false });
        })
        .catch(error => {
          this.setState({ isLoading: false, isError: true, error });
        });
    };

    render() {
      if (this.state.isLoading) {
        return <LoadingScreen />;
      } else if (this.state.isError) {
        return <ErrorScreen error={this.state.error} />;
      } else {
        let configs = Object.assign({}, this.props, this.state.config);
        return <FormComponent {...configs} />;
      }
    }
  }

  FormWithManager.propTypes = {
    updateStrategy: PropTypes.object,
    configResolver: PropTypes.object.isRequired,
    sign: PropTypes.func,
  };

  return FormWithManager;
}
