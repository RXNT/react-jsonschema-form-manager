import rfc6902 from "rfc6902";
import deepEqual from "deep-equal";
import { fetchWithCredentials, checkCredentials } from "./utils";
class FormManager {}

const DEFAULT_KEY = "form";

export class LocalStorageFormManager extends FormManager {
  constructor(key = DEFAULT_KEY) {
    super();
    this.key = key;
    this.formData = {};
  }
  doUpdate = () => {
    localStorage.setItem(this.key, JSON.stringify(this.formData));
    return Promise.resolve(this.formData);
  };
  submit = formData => {
    this.formData = formData ? formData : this.formData;
    return this.doUpdate();
  };

  onChange = ({ formData }) => {
    this.formData = formData;
  };

  sameData = () => {
    if (localStorage.getItem(this.key) !== null) {
      let savedStr = localStorage.getItem(this.key);
      let sameData = savedStr === JSON.stringify(this.formData);
      return sameData;
    }
    return false;
  };
  updateIfChanged = (force = false) => {
    if (!force && this.sameData()) {
      return undefined;
    }
    return this.doUpdate();
  };
}
/* eslint no-unused-vars: 0*/
class RESTAPI {
  constructor(url, id, credentials) {
    this.url = url;
    this.idAttribute = id;
    this.credentials = credentials;
  }
  post = formData => {
    let postReq = new Request(this.url, {
      method: "POST",
      body: JSON.stringify(formData),
    });
    return fetchWithCredentials(postReq, this.credentials).then(res =>
      res.json()
    );
  };
  put = formData => {
    let putUrl = `${this.url}/${formData[this.idAttribute]}`;
    let putReq = new Request(putUrl, {
      method: "PUT",
      body: JSON.stringify(formData),
    });
    return fetchWithCredentials(putReq, this.credentials).then(res =>
      res.json()
    );
  };
  patch = (oldFormData, formData) => {
    let patchUrl = `${this.url}/${formData[this.idAttribute]}`;
    let patchReq = new Request(patchUrl, {
      method: "PATCH",
      body: rfc6902.createPatch(oldFormData, formData),
    });
    return fetchWithCredentials(patchReq, this.credentials).then(res =>
      res.json()
    );
  };
  delete = () => {
    let deleteReq = new Request(this.url, {
      method: "DELETE",
    });
    return fetchWithCredentials(deleteReq);
  };
}

export class RESTFormManager extends FormManager {
  constructor(url, idAttribute = "id", credentials, patch = false) {
    super();
    this.idAttribute = idAttribute;
    this.api = new RESTAPI(url, idAttribute, credentials);
    this.patch = patch;

    this.formData = {};
    this.savedFormData = {};

    checkCredentials(credentials);
  }

  onChange = ({ formData }) => {
    this.formData = formData;
    if (this.id && !formData[this.idAttribute]) {
      this.formData[this.idAttribute] = this.id;
    }
  };

  submit = formData => {
    return this.api.post(formData).then(saved => {
      this.id = saved[this.idAttribute];
      return saved;
    });
  };

  isNew = () => this.formData[this.idAttribute] === undefined;

  updateIfChanged = (force = false) => {
    if (!force && deepEqual(this.formData, this.savedFormData)) {
      return Promise.resolve(this.formData);
    }
    if (this.isNew()) {
      return this.submit(this.formData);
    } else if (this.patch) {
      this.savedFormData = this.formData;
      return this.api.patch(this.savedFormData, this.formData);
    } else {
      this.savedFormData = this.formData;
      return this.api.put(this.formData);
    }
  };
}
