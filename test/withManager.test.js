import React, { Component } from "react";
import { mount } from "enzyme";
import withManager, { LocalStorageFormManager } from "../src";

let formData = {
  lastName: "Norris",
  bio: "Roundhouse kicking asses since 1940",
};

let conf = {
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
  formData: formData,
};

class DummyForm extends Component {
  render() {
    return <div id="test-form"> Test Form </div>;
  }
}

test("load config from basic promise", done => {
  let manager = new LocalStorageFormManager();
  let configResolver = Promise.resolve(conf);
  let createOutputClass = withManager(configResolver, manager);
  let OutputClass = createOutputClass(DummyForm);

  const wrapper = mount(<OutputClass />);

  wrapper.update();

  setInterval(function() {
    if (!wrapper.state("isLoading")) {
      expect(wrapper.state("isError")).toBeFalsy();
      expect(wrapper.state("formData")).toEqual(formData);

      done();
    }
  }, 50);
});

test("load config from REST promise", done => {
  global.fetch = jest.fn().mockImplementation(() => {
    var p = new Promise((resolve, reject) => {
      resolve(conf);
    });

    return p;
  });

  let manager = new LocalStorageFormManager();

  let configResolver = fetch("http://stub.com");
  let createOutputClass = withManager(configResolver, manager);
  let OutputClass = createOutputClass(DummyForm);

  const wrapper = mount(<OutputClass />);

  wrapper.update();

  setInterval(function() {
    if (!wrapper.state("isLoading")) {
      expect(wrapper.state("isError")).toBeFalsy();
      expect(wrapper.state("formData")).toEqual(formData);

      done();
    }
  }, 50);
});
