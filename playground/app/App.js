import React, { Component } from "react";
import Form from "react-jsonschema-form";
import playground from "react-jsonschema-form-playground";
import withManager from "../../src";
import {
  StaticConfigResolver,
  RESTConfigResolver,
  GraphQLConfigResolver,
} from "../../src/ConfigResolver";
import { LocalStorageFormManager } from "../../src/FormManager";

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

let staticResolver = new StaticConfigResolver(config, 1000);
let restResolver = new RESTConfigResolver(
  `http://${window.location.host}/app/config/simple.json`
);
let graphQLResolver = new GraphQLConfigResolver(
  `http://${window.location.host}/app/config/graphQL.json`
);

let allResolvers = [staticResolver, restResolver, graphQLResolver];

let localStorageManager = new LocalStorageFormManager();
let allManagers = [localStorageManager];

let FormToDisplay = withManager(allManagers[0], playground(Form));

export default class ResultForm extends Component {
  render() {
    return <FormToDisplay configResolver={allResolvers[2]} />;
  }
}
