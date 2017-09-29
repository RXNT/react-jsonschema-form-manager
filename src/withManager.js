import React, { Component } from "react";
import PropTypes from "prop-types";
import deepEqual from "deep-equal";
import { ignoreUpdateStrategy } from "./UpdateStrategy";

function DefaultLoadingScreen() {
  return (
    <div className="container">
      <h1>Loading</h1>
    </div>
  );
}

function DefaultErrorScreen({ error: { message } }) {
  return (
    <div className="container">
      <h4>Error</h4>
      <h2>{message}</h2>
    </div>
  );
}

let propTypes = {
  configPromise: PropTypes.shape({
    then: PropTypes.func.isRequired,
  }).isRequired,
  manager: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    updateIfChanged: PropTypes.func.isRequired,
  }).isRequired,
  updateStrategy: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    stop: PropTypes.func.isRequired,
  }).isRequired,
};

export default function withManager(
  configPromise,
  manager,
  updateStrategy = ignoreUpdateStrategy
) {
  updateStrategy = updateStrategy(manager);

  PropTypes.checkPropTypes(
    propTypes,
    { configPromise, manager, updateStrategy },
    "props",
    "react-jsonschema-form-manager"
  );

  const origUpdate = manager.updateIfChanged;
  manager.updateIfChanged = (force = false) => {
    let upd = origUpdate(force);
    if (upd) {
      upd.then(formData => manager.onUpdate(formData));
    }
    return upd;
  };

  return (FormComponent, LoadingScreen, ErrorScreen) => {
    class FormWithManager extends Component {
      constructor(props) {
        super(props);

        this.state = {
          isLoading: true,
          isError: false,
          configPromise: configPromise,
        };
        manager.onUpdate = this.handleUpdate;
      }

      componentWillUnmount() {
        updateStrategy.stop();
      }

      updateExternal = (state, callback) => {
        this.formData = state.formData;
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

      shouldComponentUpdate(nextProps, nextState) {
        let sameData = deepEqual(nextState.formData, this.formData);
        let sameState =
          nextState.isLoading === this.state.isLoading &&
          nextState.isError === this.state.isError;
        let sameProps = deepEqual(this.props, nextProps);
        return !sameProps || !sameData || !sameState;
      }

      componentWillMount() {
        this.state.configPromise
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

      render() {
        let { isLoading, isError, error, config, formData } = this.state;
        if (isLoading) {
          return LoadingScreen ? <LoadingScreen /> : <DefaultLoadingScreen />;
        } else if (isError) {
          return ErrorScreen ? (
            <ErrorScreen error={error} />
          ) : (
            <DefaultErrorScreen error={error} />
          );
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
