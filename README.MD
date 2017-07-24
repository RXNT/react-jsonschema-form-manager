[![Build Status](https://travis-ci.org/RxNT/react-jsonschema-form-manager.svg?branch=master)](https://travis-ci.org/RxNT/react-jsonschema-form-manager)
[![Coverage Status](https://coveralls.io/repos/github/RxNT/react-jsonschema-form-manager/badge.svg?branch=master)](https://coveralls.io/github/RxNT/react-jsonschema-form-manager?branch=master)
[![npm version](https://badge.fury.io/js/react-jsonschema-form-manager.svg)](https://badge.fury.io/js/react-jsonschema-form-manager)

# react-jsonschema-form-manager
--------

This project is opinionated implementation of a manager for [mozilla form](https://github.com/mozilla-services/react-jsonschema-form) 
or any of it's derivative projects, it provides a REST based api layer that 
handles form submission and update.

## Features

- Saving [react-jsonschema-form](https://github.com/mozilla-services/react-jsonschema-form) related json with configurable `REST` or `LocalStorage` api for testing
- Configurable form updates on data change, with `PUT` requests
- Static and `REST` form configuration support
- Flexible authentication management

## Installation

Install `react-jsonschema-form-manager` by running:

```bash
npm install --s react-jsonschema-form-manager
```

## Usage

The simplest use case would be to load static properties and save them in `localStorage`,
this can be done like this:

```js
import React from "react";
import ReactDOM from "react-dom";
import Form from "react-jsonschema-form";
import withManager, { LocalStorageFormManager, StaticConfigResolver, IntervalUpdateStrategy } from "react-jsonschema-form-manager";

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
let manager = new LocalStorageFormManager();
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
        <h1>About to launch</h1>
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
}

export default withManager(Form, CustomLoadingScreen, CustomErrorScreen);
```

## Configuration

Each mozilla form needs a configuration, which can be either pre configured or loaded from the server.
`LoadingScreen` will be displayed while configuration loads. `ConfigResolver` does not make any assumptions regarding the content
 of the configuration, so except for `schema` and `uiSchema` you can return any configuration needed.


The simplest configuration for schema configuration load, would look like this:
```js
import React, { Component } from "react";
import Form from "react-jsonschema-form";
import withManager, { StaticConfigResolver, LocalStorageFormManager }  from "react-jsonschema-form-manager";

let config = {
  schema: {
    //...
  },
  uiSchema: {
    //...
  },
  formData: {
    //...
  },
};

let configResolver = new StaticConfigResolver(config);

let localStorageManager = new LocalStorageFormManager();

let FormToDisplay = withManager(Form);

class ResultForm extends Component {
  render() {
    return (
      <FormToDisplay
        configResolver={configResolver}
        manager={localStorageManager}
      />
    );
  }
}
``` 

Here the `config` will be used as Form configuration and `StaticConfigResolver` is used to return it.
This is enough for forms to operate properly
   
There are 2 supported configuration resolvers:
- Static configuration resolver, which uses pre configured `config` setting
- REST configuration resolver, which talks to API endpoint for needed `configuration`

You can also specify your own configuration resolver.

### Static configuration

`StaticConfigResolver` takes 2 parameters `config` and `timeout`, 
- `config` is the configuration to return 
- `timeout` delay before returning configuration, it was added primarily for testing purposes

```js
import { StaticConfigResolver }  from "react-jsonschema-form-manager";
let timeout = 10000;

let config = {
  schema: {
    //...
  },
  uiSchema: {
    //...
  },
  formData: {
    //...
  },
};

let configResolver = new StaticConfigResolver(config, timeout);
```

### REST configuration

Primary configuration option is by means of `REST` API, which you can configure with needed authentication
 
`RESTConfigResolver` takes 2 parameters  
- `url` configuration url to use
- `credentials` authentication to use with url

The simplest `RESTConfigResolver` will look like this:

```js
import { RESTConfigResolver }  from "react-jsonschema-form-manager";

let configResolver = new RESTConfigResolver(`https://example.com/schema`);
```
In this case no authentication is needed and config resolver returnes json result of `REST` request

#### Authentication configuration

There are 3 options to specify `credentials` for the configuration endpoint

##### Leave it empty
 
In this case no authentication will be provided for the request

```js
import { RESTConfigResolver }  from "react-jsonschema-form-manager";

let configResolver = new RESTConfigResolver(`https://example.com/schema`);
```

##### Specify credentials object

In case authentication can be done with domain Cookies, you can simply specify credentials object in accordance with fetch documentation.
Refer to [whatwg-fetch sending cookies](https://www.npmjs.com/package/whatwg-fetch#sending-cookies) documentation for more details.


```js
import { RESTConfigResolver }  from "react-jsonschema-form-manager";

let configResolver = new RESTConfigResolver(
  `https://example.com/schema`, 
  {
    credentials: 'same-origin'
  });
```

or

```js
import { RESTConfigResolver }  from "react-jsonschema-form-manager";

let configResolver = new RESTConfigResolver(
  `https://example.com/schema`, 
  {
    credentials: 'include'
  });
```

##### Use transformation function for the Request

Transformation function, would sign fetch `Request` with any custom authentication logic needed.

For example to have a `Basic authentication` can be done like this:

```js
import { RESTConfigResolver }  from "react-jsonschema-form-manager";

let credentials = (req) => new Request(req, { headers: {
  'Authorization': 'Basic '+ btoa(`${username}:${password}`),
}});

let configResolver = new RESTConfigResolver(
  `https://example.com/schema`, 
  credentials);
```

### Custom configuration

If neither `REST` or `Static` configuration fits your needs, you can create your own configuration, by simply providing 
`resolve` method with no params, that would return `Promise` with `config` result

For example GraphQL ConfigResolver can be defined something like this:

```js
import { RESTConfigResolver }  from "react-jsonschema-form-manager";

class GraphQLConfigResolver {
  constructor(url, credentials) {
    this.restResolver = new RESTConfigResolver(url, credentials);
  }
  resolve = () => {
    return this.restResolver.resolve().then(({ data, error }) => {
      return new Promise((resolve, reject) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(data);
        }
      });
    });
  };
}
```

## Saving formData

Besides schema configuration, you need to specify the way to save formData. System supports 2 ways of saving data
- `LocalStorage` - using LocalStorage for storing submitted data, this is primarily for testing purpose
- `REST` - saving data in REST endpoint
  
The simplest configuration can look like this

```js
import React, { Component } from "react";
import Form from "react-jsonschema-form";
import withManager, { StaticConfigResolver, LocalStorageFormManager }  from "react-jsonschema-form-manager";

let config = { 
  //...
};

let configResolver = new StaticConfigResolver(config);

let localStorageManager = new LocalStorageFormManager();

let FormToDisplay = withManager(Form);

class ResultForm extends Component {
  render() {
    return (
      <FormToDisplay
        configResolver={configResolver}
        manager={localStorageManager}
        onSubmit={() => onSuccessCallback}
      />
    );
  }
}
```

In this case data is stored in `LocalStorage` and on successful submit, if there are no errors `onSuccessCallback` is called for further processing.

### Local storage

`LocalStorage` store is there only for testing purposes and not supposed to be used in production.  
You can specify a `key` under which provided form will be stored. By default `form` is used as a key and you are limited to single form.

### REST storage

As with schema configuration, this is primary option for storing your data.
 
`RESTFormManager` takes 2 parameters 
- `url` configuration url to use
- `credentials` authentication to use with url

Authentication logic is the same as for `RESTConfigurationResolver`, the only difference is that instead of the `GET`, we send a `POST` 
with `JSON` of `formData` as a request.
  
### Custom storage

As with `ConfigurationResolver` you can create your custom implementation for `FormManager`, which needs only 2 methods
`submit` and `update`, both of which should return `Promise` with saved data.

For example `FormManager` using `SessionStorage` can look something like this:
```js
class SessionStorageFormManager {
  constructor(key = DEFAULT_KEY) {
    this.key = key;
  }
  submit = formData => {
    return new Promise(resolve => {
      sessionStorage.setItem(this.key, JSON.stringify(formData));
      resolve(formData);
    });
  };
  update = formData => {
    return new Promise(resolve => {
      sessionStorage.setItem(this.key, JSON.stringify(formData));
      resolve(formData);
    });
  }
}
```






