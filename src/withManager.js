import React, { Component } from "react";
import PropTypes from "prop-types";
import { ignoreUpdateStrategy } from "./UpdateStrategy";

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
  configResolver: PropTypes.shape({
    resolve: PropTypes.func.isRequired,
  }).isRequired,
  manager: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
  }).isRequired,
  updateStrategy: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
  }).isRequired,
};

export default function withManager(
  configResolver,
  manager,
  updateStrategy = ignoreUpdateStrategy
) {
  updateStrategy = updateStrategy(manager);

  PropTypes.checkPropTypes(
    propTypes,
    { manager, configResolver, updateStrategy },
    "props",
    "react-jsonschema-form-manager"
  );

  const origUpdate = manager.update;
  manager.update = () => {
    let upd = origUpdate();
    upd.then(formData => manager.onUpdate(formData));
    return upd;
  };

  return (
    FormComponent,
    LoadingScreen = DefaultLoadingScreen,
    ErrorScreen = DefaultErrorScreen
  ) => {
    class FormWithManager extends Component {
      constructor(props) {
        super(props);

        this.state = { isLoading: true, isError: false };
        manager.onUpdate = this.handleUpdate;

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
        manager.stop();
      }

      updateExternal = (state, callback) => {
        this.setState({ formData: state.formData });
        if (callback) {
          callback(state);
        }
      };

      handleChange = state => {
        manager.onChange(state);
        updateStrategy.onChange(state);
        this.updateExternal(state, this.props.onChange);
      };

      handleSubmit = state => {
        manager.submit(state.formData).then(() => {
          this.updateExternal(state, this.props.onSubmit);
        });
      };

      handleUpdate = formData => {
        this.setState({ formData });
        if (this.props.onUpdate) {
          this.props.onUpdate(formData);
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
