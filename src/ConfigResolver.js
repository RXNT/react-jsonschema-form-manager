import "whatwg-fetch";

let defaultMapFunction = obj => {
  return obj;
};

class ConfigResolver {}

export class StaticConfigResolver extends ConfigResolver {
  constructor(configs, delay = 0) {
    super();
    this.configs = configs;
    this.delay = delay;
  }

  resolve = () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.configs), this.delay);
    });
  };
}

export class RESTConfigResolver extends ConfigResolver {
  constructor(url, credentials, defaults, mapFunction) {
    super();

    this.url = url;
    this.credentials = credentials;
    this.defaults = defaults || {};
    this.mapFunction = mapFunction || defaultMapFunction;

    if (
      credentials !== undefined &&
      credentials !== null &&
      typeof this.credentials !== "object" &&
      typeof this.credentials !== "function"
    ) {
      throw new Error("Credentials can be object or function(req)");
    }
  }

  processResponse = res => {
    let self = this;

    if (res.status != 200) {
      return res.json().then(error => Promise.reject(new Error(error)));
    }
    return res
      .json()
      .then(function(conf) {
        let mergedConf = {};
        Object.assign(mergedConf, self.defaults, conf);
        return mergedConf;
      })
      .then(this.mapFunction)
      .catch(function(ex) {
        return ex;
      });
  };

  resolve = () => {
    if (this.credentials === undefined || this.credentials === null) {
      return fetch(this.url).then(this.processResponse);
    } else if (typeof this.credentials === "object") {
      return fetch(this.url, this.credentials).then(this.processResponse);
    } else {
      let req = new Request(this.url);
      return fetch(this.credentials(req)).then(this.processResponse);
    }
  };
}
