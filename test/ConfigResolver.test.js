import { RESTConfigResolver, StaticConfigResolver } from "../src";

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
  formData: {
    lastName: "Norris",
    bio: "Roundhouse kicking asses since 1940",
  },
};

test("Static resolver", () => {
  let configResolver = new StaticConfigResolver(conf);
  return configResolver
    .resolve()
    .then(readConf => expect(readConf).toEqual(conf));
});

test("REST config resolver construction", () => {
  expect(
    () => new RESTConfigResolver("https://example.com/schema", "some")
  ).toThrow();
  expect(
    () => new RESTConfigResolver("https://example.com/schema", 12)
  ).toThrow();
  expect(
    () => new RESTConfigResolver("https://example.com/schema", undefined)
  ).not.toBeUndefined();
  expect(
    () => new RESTConfigResolver("https://example.com/schema", null)
  ).not.toBeUndefined();
  expect(
    () => new RESTConfigResolver("https://example.com/schema", () => {})
  ).not.toBeUndefined();
  expect(
    () => new RESTConfigResolver("https://example.com/schema", {})
  ).not.toBeUndefined();
});

test("REST resolver", () => {
  let configResolver = new RESTConfigResolver("http://localhost:3000/conf");
  return configResolver
    .resolve()
    .then(readConf => expect(readConf).toEqual(conf));
});

test("REST resolver with defaults provided", () => {
  let mod_conf = {};
  const defaults = { defaultTestItem: "test" };
  Object.assign(mod_conf, defaults, conf);

  let configResolver = new RESTConfigResolver(
    "http://localhost:3000/conf",
    {},
    defaults
  );
  return configResolver
    .resolve()
    .then(readConf => expect(readConf).toEqual(mod_conf));
});
