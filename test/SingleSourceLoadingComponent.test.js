import React from "react";
import { singleSourceLoadingComponentFactory } from "../src/components/singleSourceLoadingComponentFactory";
import { mount } from "enzyme";

//the single source loading compoenent is optional and is provided for convenience.
test("The single source loading component triggers onReady with the provided resolver.", () => {
  let stubLoadTrigger = jest.fn();
  let stubResolver = { testProp: "dummy-prop" };

  let SingleSourceLoadingComponent = singleSourceLoadingComponentFactory(
    stubResolver
  );
  // eslint-disable-next-line
  let loadingComponent = mount(
    <SingleSourceLoadingComponent onReady={stubLoadTrigger} />
  );

  expect(stubLoadTrigger).toHaveBeenCalledTimes(1);
  expect(stubLoadTrigger.mock.calls[0][0].testProp).toEqual("dummy-prop");
});
