const os = require('os');
const ConstantObj = require('./constants');
const fs = require('fs');
const path = require('path');

function getHeader(headerString, delimiter) {
  return headerString.split(delimiter);
}

function isFile(ip) {
  return fs.existsSync(ip);
}

function isCSVFile(ip){
  return path.extname(ip).toLowerCase() === '.csv';
}

function throwErr(mssg) {
  throw new Error(mssg);
}

function isJSObject(obj) {
  return typeof obj === 'object' ? obj : throwErr('Invalid data input');
}

function parse(data) {
  let parsed;
  try {
    parsed = JSON.parse(data);
  } catch (e) {
    parsed = data || '';
  }
  return parsed;
}

function toIterable(data) {
  let parsedData = isJSObject(parse(data));
  if (!Array.isArray(parsedData)) {
    parsedData = [parsedData];
  }
  return parsedData;
}

function setDefaultOptions(options = {}) {
  
  return {
    header: !options.header ? (ele) => ele : options.header,
    includeHeader: options.hasOwnProperty('includeHeader') ? options.includeHeader : true,
    propertyDelimiter: !options.propertyDelimiter
      ? ConstantObj.DEFAULTS.CSV_PROPERTY_DELIMITER
      : options.propertyDelimiter,
    skipError: !options.skipError ? ConstantObj.DEFAULTS.PARSE_SKIP_ERROR : options.skipError,
    callBack: options.callBack,
  };
}

async function* convertToJSON(csvString, options) {
  const returnObj = [];
  const fieldDelimiter = !options.propertyDelimiter
    ? ConstantObj.DEFAULTS.CSV_PROPERTY_DELIMITER
    : options.propertyDelimiter;
  const header = !options ? ConstantObj.DEFAULTS.CSV_INCLUDE_HEADER : options.header;
  const objectList = csvString.split(ConstantObj.DEFAULTS.CSV_RECORD_DELIMITER);
  if (objectList.length === 1) {
    throw Error();
  }
  const headerString = objectList.shift();
  const jsonFieldNames = getHeader(headerString, fieldDelimiter).map(header);
  if(!options.includeHeader){
    yield jsonFieldNames;
  }
  for (let eleIndex = 0; eleIndex < objectList.length; eleIndex += 1) {
    const currentElementList = objectList[eleIndex].split(fieldDelimiter);
    if (
      jsonFieldNames.length !== currentElementList.length
      && options.includeHeader
    ) {
      throw Error('Incorrect CSV String passed');
    }
    let returnElement = {};
    if (options.includeHeader) {
      for (
        let propertyIndex = 0;
        propertyIndex < currentElementList.length;
        propertyIndex += 1
      ) {
        returnElement[jsonFieldNames[propertyIndex]] = currentElementList[propertyIndex];
      }
    } else {
      returnElement = currentElementList;
    }
    returnObj.push(returnElement);
    yield returnElement;
  }
  return null;
}

async function* generateLines(parsedData, { propertyDelimiter, header, includeHeader }) {
  let headerLine;
  for (const datum of parsedData) {
    if (includeHeader && !headerLine) {
      const currentKeys = Object.keys(datum).map(header);
      headerLine = currentKeys.join(propertyDelimiter) + os.EOL;
      yield headerLine;
    }
    const line = Object.values(datum).join(propertyDelimiter);
    yield line + os.EOL;
  }
  return null;
}


module.exports = {
  convertToJSON,
  isFile,
  getHeader,
  throwErr,
  toIterable,
  setDefaultOptions,
  isJSObject,
  generateLines,
  parse,
  isCSVFile
};
