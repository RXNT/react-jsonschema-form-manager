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

export function fetchWithCredentials(req, credentials) {
  if (credentials === undefined || credentials === null) {
    return fetch(req);
  } else if (typeof credentials === "object") {
    return fetch(req, credentials);
  } else {
    return fetch(credentials(req));
  }
}
