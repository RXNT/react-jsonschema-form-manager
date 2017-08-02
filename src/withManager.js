import React, { Component } from "react";
import PropTypes from "prop-types";
import { IgnoreUpdateStrategy } from "./UpdateStrategy";

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

let propTypes = {
  updateStrategy: PropTypes.shape({
    stop: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
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

export default function withManager(
  configResolver,
  manager,
  updateStrategy = IgnoreUpdateStrategy
) {
  PropTypes.checkPropTypes(
    propTypes,
    { manager, configResolver, updateStrategy },
    "props",
    "react-jsonschema-form-manager"
  );
  return (
    FormComponent,
    LoadingScreen = DefaultLoadingScreen,
    ErrorScreen = DefaultErrorScreen
  ) => {
    class FormWithManager extends Component {
      constructor(props) {
        super(props);

        this.state = { isLoading: true, isError: false };
        this.listenToUpdateStrategy(this.props);

        configResolver
          .resolve()
          .then(config => {
            this.setState({ isLoading: false, isEqual: false, config });
          })
          .catch(error => {
            this.setState({ isLoading: false, isError: true, error });
          });
      }

      listenToUpdateStrategy({ onUpdate }) {
        if (onUpdate) {
          updateStrategy.subscribe(formData =>
            manager.update(formData).then(saved => onUpdate(saved))
          );
        } else {
          updateStrategy.subscribe(formData => manager.update(formData));
        }
      }

      componentWillReceiveProps(nextProps) {
        if (this.props.onUpdate != nextProps.onUpdate) {
          this.listenToUpdateStrategy(nextProps);
        }
      }

      componentWillUnmount() {
        updateStrategy.stop();
      }

      onChange = state => {
        let { onChange } = this.props;
        updateStrategy.onChange(state.formData);
        if (onChange) {
          onChange(state);
        }
      };

      onSubmit = state => {
        let { onSubmit } = this.props;
        let submit = manager
          .submit(state.formData)
          .then(() => updateStrategy.stop());
        if (onSubmit) {
          submit.then(() => onSubmit(state));
        }
      };

      render() {
        let { isLoading, isError, error, config } = this.state;
        if (isLoading) {
          return <LoadingScreen />;
        } else if (isError) {
          return <ErrorScreen error={error} />;
        } else {
          let configs = Object.assign({}, this.props, config);
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

    return FormWithManager;
  };
}
