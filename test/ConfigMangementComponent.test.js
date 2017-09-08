import React, { Component } from "react";
import withManager from "../src/withManager";
import { mount } from "enzyme";
import { LocalStorageFormManager } from "../src/FormManager";

class DummyConfigManager extends Component {
  render() {
    return <div id="test-handle"> Test Handle </div>;
  }
}

class DummyForm extends Component {
  render() {
    return <div id="test-form"> Test Form </div>;
  }
}

test("withForm provides a class that renders the config management component.", () => {
  let manager = new LocalStorageFormManager();
  let createOutputClass = withManager(DummyConfigManager, manager);
  let OutputClass = createOutputClass(DummyForm);

  const wrapper = mount(<OutputClass />);
  wrapper.setState({ isLoading: false });
  expect(wrapper.find("#test-handle")).toHaveLength(1);
});
