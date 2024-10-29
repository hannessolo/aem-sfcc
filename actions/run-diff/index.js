/*
* <license header>
*/

/* eslint-disable import/extensions */
/* eslint-disable no-underscore-dangle */

const { Core } = require('@adobe/aio-sdk');
const { parse } = require('node-html-parser');
const AdmZip = require('adm-zip');
const { XMLParser } = require('fast-xml-parser');
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

    const baseUrl = 'https://zzky-001.dx.commercecloud.salesforce.com';
    const listingEndpoint = '/on/demandware.servlet/webdav/Sites/Impex/src/platform/outbox/catalog_delta/catalog_delta';

    const username = params.USERNAME;
    const password = params.PASSWORD;

    const response = await fetch(`${baseUrl}${listingEndpoint}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        statusText: response.statusText,
      };
    }

    const body = await response.text();
    const parsedBody = parse(body);

    const lastUrl = parsedBody.querySelector('tr:last-child > td > a').getAttribute('href');
    const zipFileResponse = await fetch(`${baseUrl}${lastUrl}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
      },
    });

    if (!zipFileResponse.ok) {
      return {
        statusCode: zipFileResponse.status,
        statusText: zipFileResponse.statusText,
      };
    }

    const zipBuffer = Buffer.from(await zipFileResponse.arrayBuffer());

    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();

    const xmlParser = new XMLParser({ ignoreAttributes: false, attributesGroupName: '@attributes' });

    // iterate categories (stored as separate xml files in zip)
    await Promise.all(zipEntries.map(async (entry) => {
      if (!(entry.entryName.includes('catalogs') && entry.entryName.endsWith('.xml'))) {
        return;
      }
      // entry is a catalog item xml file. Read it.
      const content = entry.getData().toString('utf-8');

      const obj = xmlParser.parse(content);

      const category = obj.catalog?.['@attributes']['@_catalog-id'];
      await Promise.all(obj.catalog?.product?.map(async (product) => {
        // preview URL
        const adminBaseUrl = 'https://admin.hlx.page/preview/hannessolo/aem-sfcc/main';
        const sku = product['@attributes']['@_product-id'];
        const path = `${category}/${sku}`;
        logger.debug(path);

        // preview the product page
        await fetch(`${adminBaseUrl}/${path}`, {
          method: 'POST',
        }).then((res) => {
          logger.debug(res.status);
        });
      }));
    }));

    return {
      statusCode: 200,
    };
  } catch (error) {
    // log any server errors
    logger.error(error);
    // return with 500
    return errorResponse(500, 'server error', logger);
  }
}

exports.main = main;
