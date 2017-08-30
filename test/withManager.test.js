import React, { Component } from "react";
import withManager from "../src/withManager";
import { mount } from "enzyme";
import { LocalStorageFormManager } from "../src/FormManager";
import { singleSourceLoadingComponentFactory } from "../src/components/singleSourceLoadingComponentFactory";
import { StaticConfigResolver } from "../src/ConfigResolver";

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

//Purposely doesn't trigger onLoad handler.
class StubbedLoadComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div id="dummy-load"> Dummy Load </div>;
  }
}

test("generated component has default state of isLoading = true.", () => {
  let manager = new LocalStorageFormManager();
  let createOutputClass = withManager(DummyConfigManager, manager);
  let OutputClass = createOutputClass(DummyForm, StubbedLoadComponent);

  const wrapper = mount(<OutputClass />);
  expect(wrapper.state("isLoading")).toEqual(true);
});

test("when state isLoading=true, only loading component renders.", () => {
  let manager = new LocalStorageFormManager();
  let createOutputClass = withManager(DummyConfigManager, manager);
  let OutputClass = createOutputClass(DummyForm, StubbedLoadComponent);

  const wrapper = mount(<OutputClass />);
  expect(wrapper.state("isLoading")).toEqual(true);
  expect(wrapper.find("#dummy-load")).toHaveLength(1);
  expect(wrapper.find("#test-form")).toHaveLength(0);
});

test("on state change to isLoading=false, config management and form components both render.", () => {
  let manager = new LocalStorageFormManager();
  let createOutputClass = withManager(DummyConfigManager, manager);
  let OutputClass = createOutputClass(DummyForm, StubbedLoadComponent);

  const wrapper = mount(<OutputClass />);
  wrapper.setState({ isLoading: false });
  expect(wrapper.find("#test-handle")).toHaveLength(1);
  expect(wrapper.find("#test-form")).toHaveLength(1);
});

test("when loading component calls onLoad, must provide a configResolver instance", () => {
  let manager = new LocalStorageFormManager();
  let createOutputClass = withManager(DummyConfigManager, manager);

  let badResolver = {};
  let MalformedLoadComponent = singleSourceLoadingComponentFactory(badResolver);
  let OutputClass = createOutputClass(DummyForm, MalformedLoadComponent);

  const wrapper = mount(<OutputClass />);

  expect(wrapper.state("isError")).toEqual(true);
  expect(wrapper.state("isLoading")).toEqual(false);

  let noResolver = null;
  MalformedLoadComponent = singleSourceLoadingComponentFactory(noResolver);
  OutputClass = createOutputClass(DummyForm, MalformedLoadComponent);

  const wrapper2 = mount(<OutputClass />);

  expect(wrapper2.state("isError")).toEqual(true);
  expect(wrapper2.state("isLoading")).toEqual(false);
});

//integration test, but captures important behavior.
test("If a properly constructed LoadingComponent is provided, it is resolved and state is eventually updated.", done => {
  let manager = new LocalStorageFormManager();
  let createOutputClass = withManager(DummyConfigManager, manager);

  let configResolver = new StaticConfigResolver({});
  let ProperLoadComponent = singleSourceLoadingComponentFactory(configResolver);
  let OutputClass = createOutputClass(DummyForm, ProperLoadComponent);

  const wrapper = mount(<OutputClass />);
  wrapper.update();

  setInterval(function() {
    if (wrapper.state("isLoading") === false) {
      expect(wrapper.state("isError")).toEqual(false);
      done();
    }
  }, 100);
});

test("generated component renders properly when DefaultConfigManagementComponent is used.", () => {
  let manager = new LocalStorageFormManager();
  let createOutputClass = withManager(undefined, manager);
  let OutputClass = createOutputClass(DummyForm, StubbedLoadComponent);

  const wrapper = mount(<OutputClass />);
  wrapper.setState({ isLoading: false });

  expect(wrapper.find("#dummy-load")).toHaveLength(0);
  expect(wrapper.find("#test-form")).toHaveLength(1);
});
