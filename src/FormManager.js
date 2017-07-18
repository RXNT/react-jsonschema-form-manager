class FormManager {}

const DEFAULT_KEY = "form";

export class LocalStorageFormManager extends FormManager {
  constructor(key = DEFAULT_KEY) {
    super();
    this.key = key;
  }
  submit = formData => {
    return new Promise(resolve => {
      localStorage.setItem(this.key, JSON.stringify(formData));
      resolve(formData);
    });
  };
}

export class RESTFormManager extends FormManager {
  constructor(url, credentials) {
    super();
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
  submit = formData => {
    let req = new Request(this.url, {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (this.credentials === undefined || this.credentials === null) {
      return fetch(req).then(res => res.json());
    } else if (typeof this.credentials === "object") {
      return fetch(req, this.credentials).then(res => res.json());
    } else {
      return fetch(this.credentials(req)).then(res => res.json());
    }
  };
}
