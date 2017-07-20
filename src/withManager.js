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
        <h4>Error</h4>
        <h2>
          {this.props.error.message}
        </h2>
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
      let { configResolver } = this.props;
      this.resolveConfig(configResolver);
    }

    componentWillUnmount() {
      let { updateStrategy } = this.props;
      if (updateStrategy) {
        updateStrategy.stop();
      }
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

    onChange = state => {
      let { onChange, manager, updateStrategy } = this.props;
      if (updateStrategy) {
        updateStrategy.onChange(state.formData, manager);
      }
      if (onChange) {
        onChange(state);
      }
    };

    onSubmit = state => {
      let { onSubmit, manager, updateStrategy } = this.props;
      let submit = manager.submit(state.formData);
      if (onSubmit) {
        submit.then(() => onSubmit(state));
      }
      if (updateStrategy) {
        submit.then(() => updateStrategy.stop());
      }
    };

    render() {
      if (this.state.isLoading) {
        return <LoadingScreen />;
      } else if (this.state.isError) {
        return <ErrorScreen error={this.state.error} />;
      } else {
        let configs = Object.assign({}, this.props, this.state.config);
        return (
          <FormComponent
            {...configs}
            onSubmit={this.onSubmit}
            onChange={this.onChange}
          />
        );
      }
    }
  }

  FormWithManager.propTypes = {
    updateStrategy: PropTypes.shape({
      stop: PropTypes.func.isRequired,
      onChange: PropTypes.func.isRequired,
    }),
    configResolver: PropTypes.shape({
      resolve: PropTypes.func.isRequired,
    }),
    manager: PropTypes.shape({
      submit: PropTypes.func.isRequired,
      update: PropTypes.func.isRequired,
    }),
  };

  return FormWithManager;
}
