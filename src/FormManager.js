import rfc6902 from "rfc6902";
import deepEqual from "deep-equal";
import { doFetch, checkCredentials } from "./utils";
class FormManager {}

const DEFAULT_KEY = "form";

export class LocalStorageFormManager extends FormManager {
  constructor(key = DEFAULT_KEY) {
    super();
    this.key = key;
  }
  doUpdate = () => {
    let formData = this.formData;
    localStorage.setItem(this.key, JSON.stringify(formData));
    return Promise.resolve(formData);
  };
  submit = formData => {
    this.formData = formData ? formData : this.formData;
    return this.doUpdate();
  };

  onChange = ({ formData }) => {
    this.formData = formData;
  };
  update = () => {
    return this.doUpdate();
  };
}

export class RESTFormManager extends FormManager {
  constructor(url, credentials, patch = false) {
    super();
    this.url = url;
    this.patch = patch;
    this.credentials = credentials;

    this.formData = {};
    this.savedFormData = {};

    checkCredentials(credentials);
  }

  toSubmitRequest = formData => {
    return new Request(this.url, {
      method: "POST",
      body: JSON.stringify(formData),
    });
  };
  submit = formData => {
    let submitData = formData ? formData : this.formData;
    let req = this.toSubmitRequest(submitData);

    this.formData = submitData;
    this.savedFormData = submitData;

    return doFetch(req, this.credentials);
  };

  onChange = ({ formData }) => {
    this.formData = formData;
  };

  toUpdateRequest = () => {
    if (this.patch) {
      return new Request(this.url, {
        method: "PATCH",
        body: rfc6902.createPatch(this.savedFormData, this.formData),
      });
    } else {
      return new Request(this.url, {
        method: "PUT",
        body: JSON.stringify(this.formData),
      });
    }
  };
  update = () => {
    if (deepEqual(this.formData, this.savedFormData)) {
      return Promise.resolve(this.formData);
    }
    this.savedFormData = this.formData;

    let req = this.toUpdateRequest();
    return doFetch(req, this.credentials);
  };
}
