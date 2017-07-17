import React, { Component } from "react";
import PropTypes from "prop-types";

export default function withManager(FormComponent, LoadingScreen, ErrroScreen) {
  class FormWithManager extends Component {
    constructor(props) {
      super(props);

      this.resolveSchema(this.props.configResolver);
    }

    resolveSchema = schemaResolver => {
      schemaResolver.resolve().then(config => this.setState({ config }));
    };

    render() {
      let configs = Object.assign({}, this.props, this.state.config);
      return <FormComponent {...configs} />;
    }
  }

  FormWithManager.propTypes = {
    updateStrategy: PropTypes.object,
    configResolver: PropTypes.object.isRequired,
    sign: PropTypes.func,
  };

  return FormWithManager;
}
