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

        configResolver
          .resolve()
          .then(config => {
            this.setState({
              isLoading: false,
              isEqual: false,
              config,
              formData: config.formData,
            });
          })
          .catch(error => {
            this.setState({ isLoading: false, isError: true, error });
          });
      }

      componentWillUnmount() {
        updateStrategy.stop();
      }

      handleUpdate = formData => {
        let updateManager = manager.update(formData);
        if (this.props.onUpdate) {
          updateManager.then(formData => this.props.onUpdate(formData));
        } else {
          updateStrategy.subscribe(formData => manager.update(formData));
        }
      };

      handleChange = state => {
        updateStrategy.onChange(state.formData, this.handleUpdate);
        this.setState({ formData: state.formData });

        let { onChange } = this.props;
        if (onChange) {
          onChange(state);
        }
      };

      handleSubmit = state => {
        let submit = manager
          .submit(state.formData)
          .then(() => updateStrategy.stop());

        let { onSubmit } = this.props;
        if (onSubmit) {
          submit.then(() => onSubmit(state));
        }
      };

      render() {
        let { isLoading, isError, error, config, formData } = this.state;
        if (isLoading) {
          return <LoadingScreen />;
        } else if (isError) {
          return <ErrorScreen error={error} />;
        } else {
          let configs = Object.assign({}, this.props, config, { formData });
          return (
            <FormComponent
              {...configs}
              onSubmit={this.handleSubmit}
              onChange={this.handleChange}
            />
          );
        }
      }
    }

    return FormWithManager;
  };
}
