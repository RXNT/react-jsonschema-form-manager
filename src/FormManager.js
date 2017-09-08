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
  constructor(url, credentials, id = "id") {
    this.id = id;
    this.url = url;
    this.credentials = credentials;
  }
  post = formData => {
    let postReq = new Request(this.url, {
      method: "POST",
      body: JSON.stringify(formData),
    });
    return fetchWithCredentials(postReq, this.credentials)
      .then(res => res.json())
      .then(resp => {
        let key = resp[this.id];
        if (key) {
          this.url = `${this.url}/${key}`;
        }
        return resp;
      });
  };
  put = formData => {
    let putReq = new Request(this.url, {
      method: "PUT",
      body: JSON.stringify(formData),
    });
    return fetchWithCredentials(putReq, this.credentials).then(res =>
      res.json()
    );
  };
  patch = (oldFormData, formData) => {
    let patchReq = new Request(this.url, {
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
  constructor(url, credentials, id = "id", patch = false) {
    super();
    this.url = url;
    this.id = id;
    this.patch = patch;
    this.credentials = credentials;

    this.formData = {};
    this.savedFormData = {};

    checkCredentials(credentials);
  }

  onChange = ({ formData }) => {
    this.formData = formData;
  };

  isSaved = () => this.formData[this.id] !== undefined;

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

    return fetchWithCredentials(req, this.credentials).then(res => res.json());
  };

  toUpdateRequest = () => {
    if (!this.isSaved()) {
      return this.toSubmitRequest(this.formData);
    } else if (this.patch) {
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
  updateIfChanged = (force = false) => {
    if (!force && deepEqual(this.formData, this.savedFormData)) {
      return undefined;
    }
    this.savedFormData = this.formData;

    let req = this.toUpdateRequest();
    return fetchWithCredentials(req, this.credentials).then(res => res.json());
  };
}
