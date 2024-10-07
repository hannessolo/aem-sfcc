/*
* <license header>
*/

/* eslint-disable import/extensions */

const fetch = require('node-fetch');
const { Core } = require('@adobe/aio-sdk');
const {
  errorResponse, stringParameters, checkMissingRequestInputs,
} = require('../utils');

// main function that will be executed by Adobe I/O Runtime
async function main(params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' });

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action');

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params));

    // check for missing request input parameters and headers
    const requiredParams = [/* add required params */];
    const requiredHeaders = [];
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders);
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger);
    }

    // replace this with the api you want to access
    const apiEndpoint = 'https://adobeioruntime.net/api/v1';

    // fetch content from external api endpoint
    const res = await fetch(apiEndpoint);
    if (!res.ok) {
      throw new Error(`request to ${apiEndpoint} failed with status code ${res.status}`);
    }
    const content = await res.json();
    const response = {
      statusCode: 200,
      body: { ...content, foo: 'bar' },
    };

    // log the response status code
    logger.info(`${response.statusCode}: successful request`);
    return response;
  } catch (error) {
    // log any server errors
    logger.error(error);
    // return with 500
    return errorResponse(500, 'server error', logger);
  }
}

exports.main = main;