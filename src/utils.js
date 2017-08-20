export function checkCredentials(credentials) {
  if (
    credentials !== undefined &&
    credentials !== null &&
    typeof this.credentials !== "object" &&
    typeof this.credentials !== "function"
  ) {
    throw new Error("Credentials can be object or function(req)");
  }
}

export function doFetch(req, credentials) {
  if (credentials === undefined || credentials === null) {
    return fetch(req).then(res => res.json());
  } else if (typeof credentials === "object") {
    return fetch(req, credentials).then(res => res.json());
  } else {
    return fetch(credentials(req)).then(res => res.json());
  }
}
