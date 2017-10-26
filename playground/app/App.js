import React, { Component } from "react";
import Form from "react-jsonschema-form";
import withManager, {
  RESTFormManager,
  intervalUpdateStrategy,
} from "../../src";

let config = {
  schema: {
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      id: {
        type: "string",
      },
      firstName: {
        type: "string",
        title: "First name",
      },
      lastName: {
        type: "string",
        title: "Last name",
      },
      age: {
        type: "integer",
        title: "Age",
      },
      bio: {
        type: "string",
        title: "Bio",
      },
      password: {
        type: "string",
        title: "Password",
        minLength: 3,
      },
      telephone: {
        type: "string",
        title: "Telephone",
        minLength: 10,
      },
    },
  },
  uiSchema: {
    firstName: {
      classNames: "success",
      "ui:autofocus": true,
      "ui:emptyValue": "",
    },
    age: {
      "ui:widget": "updown",
      "ui:title": "Age of person",
    },
    bio: {
      "ui:widget": "textarea",
    },
    password: {
      "ui:widget": "password",
      "ui:help": "Hint: Make it strong!",
    },
    date: {
      "ui:widget": "alt-datetime",
    },
    telephone: {
      "ui:options": {
        inputType: "tel",
      },
    },
  },
  formData: {
    lastName: "Norris",
    bio: "Roundhouse kicking asses since 1940",
  },
};

let configPromise = Promise.resolve(config);
let storageManager = new RESTFormManager("/posts");

let FormToDisplay = withManager(
  configPromise,
  storageManager,
  intervalUpdateStrategy(10000)
)(Form);

function LastUpdated({ lastUpdated }) {
  return <div className="pull-right">{lastUpdated.toString()}</div>;
}

export default class ResultForm extends Component {
  constructor(props) {
    super(props);
    this.state = { lastUpdated: new Date() };
  }
  handleUpdated = () => {
    this.setState({ lastUpdated: new Date() });
  };
  triggerUpdate = () => {
    storageManager.updateIfChanged(true);
  };
  handleChange = ({ formData }) => {
    console.log(`${JSON.stringify(formData)}`);
  };
  render() {
    return (
      <div className="container">
        <LastUpdated lastUpdated={this.state.lastUpdated} />
        <FormToDisplay
          onChange={this.handleChange}
          onUpdate={this.handleUpdated}>
          <button className="btn" onClick={this.triggerUpdate}>
            Update
          </button>
        </FormToDisplay>
      </div>
    );
  }
}
