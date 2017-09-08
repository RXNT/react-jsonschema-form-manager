import "whatwg-fetch";
import { fetchWithCredentials } from "./utils";

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
  constructor(url, credentials, outputHandler) {
    super();

    let inactiveOutputHandler = obj => {
      return obj;
    };

    this.url = url;
    this.credentials = credentials;
    this.outputHandler = outputHandler || inactiveOutputHandler;

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
    if (res.status != 200) {
      return res.json().then(error => Promise.reject(new Error(error)));
    }
    return res
      .json()
      .then(function(conf) {
        let mergedConf = {};
        Object.assign(mergedConf, conf);
        return mergedConf;
      })
      .then(this.outputHandler)
      .catch(function(ex) {
        return ex;
      });
  };

  resolve = () => {
    return fetchWithCredentials(new Request(this.url), this.credentials).then(
      this.processResponse
    );
  };
}
