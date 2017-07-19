[![Build Status](https://travis-ci.org/RxNT/react-jsonschema-form-manager.svg?branch=master)](https://travis-ci.org/RxNT/react-jsonschema-form-manager)
[![Coverage Status](https://coveralls.io/repos/github/RxNT/react-jsonschema-form-manager/badge.svg?branch=master)](https://coveralls.io/github/RxNT/react-jsonschema-form-manager?branch=master)


# react-jsonschema-form-manager
--------

This project is opinionated implementation of a manager for [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form) 
or any of it's derivative projects, it provides a REST based api layer that 
handles form submit and update.

## Features

- Saving [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form) related json with configurable `REST` api
- Optional submitting form updates on data change, with `PATCH` and `PUT` requests
- Form configuration sync and async load support with `REST`
- Configurable authentication support

## Installation

Install `react-jsonschema-form-manager` by running:

```bash
npm install --s react-jsonschema-form-manager
```

## Usage

The simplest use case would be to load static properties and save them in `localStorage`,
this an be done like this:

```js
import React from "react";
import ReactDOM from "react-dom";
import Form from "react-jsonschema-form";
import withManager from "react-jsonschema-form-manager";
import { LocalStorageFormManager } from "react-jsonschema-form-manager/FormManager";
import { StaticConfigResolver } from "react-jsonschema-form-manager/ConfigResolver";

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
      }
    }
  }
};

let configResolver = new StaticConfigResolver(config);
let manager = new LocalStorageFormManager()

let FormToDisplay = withManager(Form);

ReactDOM.render(<FormToDisplay configResolver={configResolver} manager={manager} />, document.getElementById("app"));
```

## Update


