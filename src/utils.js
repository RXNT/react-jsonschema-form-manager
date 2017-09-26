export function checkCredentials(credentials) {
  if (
    credentials !== undefined &&
    credentials !== null &&
    typeof credentials !== "object" &&
    typeof credentials !== "function"
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
    let signedReq = credentials(req);
    return Promise.resolve(signedReq).then(req => fetch(req));
  }
}
