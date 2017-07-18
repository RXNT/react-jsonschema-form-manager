import "whatwg-fetch";

export class StaticConfigResolver {
  constructor(configs, delay = 0) {
    this.configs = configs;
    this.delay = delay;
  }

  resolve = () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.configs), this.delay);
    });
  };
}

export class RESTConfigResolver {
  constructor(url, credentials) {
    this.url = url;
    this.credentials = credentials;
    if (
      credentials !== undefined &&
      credentials !== null &&
      typeof this.credentials !== "object" &&
      typeof this.credentials !== "function"
    ) {
      throw new Error("Credentials can be object or function(req)");
    }
  }

  resolve = () => {
    if (this.credentials === undefined || this.credentials === null) {
      return fetch(this.url).then(res => res.json());
    } else if (typeof this.credentials === "object") {
      return fetch(this.url, this.credentials).then(res => res.json());
    } else {
      let req = new Request(this.url);
      return fetch(this.credentials(req)).then(res => res.json());
    }
  };
}
