/*
* <license header>
*/

/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */

const { Core } = require('@adobe/aio-sdk');
const {
  errorResponse, stringParameters, checkMissingRequestInputs,
} = require('../utils');
const { getHtml } = require('./html-template');

// main function that will be executed by Adobe I/O Runtime
async function main(params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' });

  const path = params.__ow_path;

  const paths = [
    'products/hats',
  ];

  if (!paths.includes(path) && !paths.map((p) => `/${p}`).includes(path)) {
    return {
      statusCode: 404,
    };
  }

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

    return {
      statusCode: 200,
      headers: {
        'content-type': 'text/html',
      },
      body: getHtml(),
    };
  } catch (error) {
    // log any server errors
    logger.error(error);
    // return with 500
    return errorResponse(500, 'server error', logger);
  }
}

exports.main = main;
