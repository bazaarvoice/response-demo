import { makeBasicJSONRequest } from '../utils/JSONRequest';
import * as querystring from 'querystring';
import { configurations }  from '../utils/config.js';


export function getReviewDataById(reviewId) {
  /*
  Query conversations API to get a review corresponding to a Review ID
  */
  const conversationsConfig = configurations.conversations;

  const queryParams = {
    Passkey: conversationsConfig.passkey,
    ApiVersion: conversationsConfig.version,
    filter: `id:${reviewId}`,
    appname: 'clientresponse-demo',
    include: 'products'
  };
  const queryString = querystring.stringify(queryParams);
  return makeBasicJSONRequest(`${conversationsConfig.endpoint}/reviews.json?${queryString}`, {
    method: 'get'
  });
}


export function checkLogin() {
  /*
  Query application's own backend for
  verifying if an user is logged in or not
  */
  return makeBasicJSONRequest('/api/check-login', {
    method: 'get'
  });
}


export function getClientResponsesForReview(client, reviewId) {
  /*
  Query application's own backend for getting all Client
  Responses corresponding to a Client Name and Review ID
  */
  return makeBasicJSONRequest(`/api/sites/${client}/reviews/${reviewId}/clientResponses`, {
    method: 'get'
  });
}

export function getClientResponse(responseGuid) {
  /*
  Query application's own backend for getting a Client
  Response corresponding to a Response GUID
  */
  return makeBasicJSONRequest(`/api/clientResponses/${responseGuid}`, {
    method: 'get'
  });
}
