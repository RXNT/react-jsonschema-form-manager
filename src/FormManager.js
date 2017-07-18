class FormManager {}

const DEFAULT_KEY = "form";

export class LocalStorageFormManager extends FormManager {
  constructor(key = DEFAULT_KEY) {
    super();
    this.key = key;
  }
  submit = formData => {
    return new Promise(resolve => {
      localStorage.setItem(this.key, formData);
      resolve(formData);
    });
  };
  update = formData => {
    return new Promise(resolve => {
      localStorage.setItem(this.key, formData);
      resolve(formData);
    });
  };
}

export class RESTFormManager extends FormManager {
  constructor(url, credentials) {
    super();
    this.url = url;
    this.credentials = credentials;
  }
}

export class GraphQLFormManager {}
