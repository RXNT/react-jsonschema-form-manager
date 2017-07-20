[![Build Status](https://travis-ci.org/RxNT/react-jsonschema-form-manager.svg?branch=master)](https://travis-ci.org/RxNT/react-jsonschema-form-manager)
[![Coverage Status](https://coveralls.io/repos/github/RxNT/react-jsonschema-form-manager/badge.svg?branch=master)](https://coveralls.io/github/RxNT/react-jsonschema-form-manager?branch=master)
[![npm version](https://badge.fury.io/js/react-jsonschema-form-manager.svg)](https://badge.fury.io/js/react-jsonschema-form-manager)

# react-jsonschema-form-manager
--------

This project is opinionated implementation of a manager for [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form) 
or any of it's derivative projects, it provides a REST based api layer that 
handles form submit and update.

## Features

- Saving [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form) related json with configurable `REST` or `LocalStorage` api for testing
- Configurable form updates on data change, with `PUT` requests
- Static and `REST` form configuration support
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
import { IntervalUpdateStrategy } from 'react-jsonschema-form-manager/UpdateStrategy'

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
let updateStrategy = new IntervalUpdateStrategy();

let FormToDisplay = withManager(Form);

ReactDOM.render(<FormToDisplay 
  configResolver={configResolver} 
  manager={manager}
  updateStrategy={updateStrategy}
  />, document.getElementById("app"));
```

Functional part of API consist of 3 parts
- Configuration loader (`static` or `REST`)
- Manager (`localStorage` or `REST`)
- Update strategy (`imediate` or `interval`)

You can configure and extend them independently of one another, to get functionality you need.

## UI Workflow

UI workflow consists of 2 phases
- `LoadingScreen` - display loading, while configuration is resolved
- Show provided `form` with loaded configuration, or display an `ErrorScreen` screen in case configuration can't be resolved

You can override default presentations, when you call `withManager`

```js
import React, { Component } from "react";
import Form from "react-jsonschema-form";
import withManager from "react-jsonschema-form-manager";

class CustomLoadingScreen extends Component {
  render() {
    return (
      <div className="container">
        <h1>Look at me I'm loading</h1>
      </div>
    );
  }
}

class CustomErrorScreen extends Component {
  render() {
    return (
      <div className="container">
        <h4>Houston, we have a problem</h4>
        <h2>
          {this.props.error.message}
        </h2>
      </div>
    );
  }

export default withManager(Form, CustomLoadingScreen, CustomErrorScreen);
```

## Configuration



### Static configuration load

### REST configuration load

### Custom configuration load


