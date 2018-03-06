import { makeBasicJSONRequest } from '../utils/JSONRequest';
import * as querystring from 'querystring';
import { configurations, getenv }  from '../utils/config.js';


export function getReviewDataById(reviewId) {

  const conversationsConfig = configurations[getenv()].conversations;

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
