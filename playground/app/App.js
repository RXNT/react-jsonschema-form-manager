import React, { Component } from "react";
import Form from "react-jsonschema-form";
import playground from "react-jsonschema-form-playground";
import withManager, {
  StaticConfigResolver,
  LocalStorageFormManager,
  instantUpdateStrategy,
} from "../../src";

let config = {
  schema: {
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
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

let staticResolver = new StaticConfigResolver(config, 100);
let storageManager = new LocalStorageFormManager();

let FormToDisplay = withManager(
  staticResolver,
  storageManager,
  instantUpdateStrategy
)(playground(Form));

function LastUpdated({ lastUpdated }) {
  return (
    <div className="pull-right">
      {lastUpdated.toString()}
    </div>
  );
}

export default class ResultForm extends Component {
  constructor(props) {
    super(props);
    this.state = { lastUpdated: new Date() };
  }
  handleUpdated = () => {
    this.setState({ lastUpdated: new Date() });
  };
  handleUpdate = () => {
    storageManager.update();
  };
  render() {
    return (
      <div>
        <LastUpdated lastUpdated={this.state.lastUpdated} />
        <FormToDisplay
          onChange={() => console.log("Here I am")}
          onUpdate={this.handleUpdated}>
          <button className="btn" onClick={this.handleUpdate}>
            Update
          </button>
        </FormToDisplay>
      </div>
    );
  }
}
