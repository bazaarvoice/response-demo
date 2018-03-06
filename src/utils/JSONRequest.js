// A module to encapsulate making HTTP requests into simple function calls

function makeBasicRequest(url, options) {
  return fetch(url, options).then(response => {
    return response;
  });
}

export function makeBasicJSONRequest(url, options) {
  return makeBasicRequest(url, options).then(response => response.json());
}
