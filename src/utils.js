const ConstantObj = require('./constants');

function getHeader(headerString) {
  return headerString.split(ConstantObj.DEFAULTS.CSV_PROPERTY_DELIMITER);
}


function isFileLocationValid() {
  return false;
}

function convertToJSON(csvString, propertyDelimiter, objectDelimiter){
  // console.log(csvString);
  const returnObj = [];
  if (propertyDelimiter === undefined) {
    // eslint-disable-next-line no-param-reassign
    propertyDelimiter = ConstantObj.DEFAULTS.CSV_PROPERTY_DELIMITER;
  }
  if (objectDelimiter === undefined) {
    // eslint-disable-next-line no-param-reassign
    objectDelimiter = ConstantObj.DEFAULTS.CSV_OBJECT_DELIMITER;
  }
  const objectList = csvString.split(objectDelimiter);
  if (objectList.length === 1) {
    throw TypeError('incorrect input type');
  }
  const headerString = objectList.shift();
  const jsonFieldNames = getHeader(headerString);
  for (let eleIndex = 0; eleIndex < objectList.length; eleIndex += 1) {
    const currentElementList = objectList[eleIndex].split(propertyDelimiter);
    if (jsonFieldNames.length !== currentElementList.length) {
      throw Error('Incorrect CSV String passed');
    }
    const returnElement = {};
    for (
      let propertyIndex = 0;
      propertyIndex < currentElementList.length;
      propertyIndex += 1
    ) {
      returnElement[jsonFieldNames[propertyIndex]] = currentElementList[propertyIndex];
    }
    returnObj.push(returnElement);
  }
  return returnObj;
};

function throwErr(mssg){
  throw new Error(mssg);
}

function toIterable(data){
  let parsedData = isJSObject(parse(data))
  if(!Array.isArray(parsedData)){
    parsedData = [parsedData];
  }
  return parsedData;
}

function setDefaultOptions(options = {}){
  return {
    header : options.hasOwnProperty('header')  ? header : true,
    propertyDelimiter : !options.propertyDelimiter ? options.propertyDelimiter : ConstantObj.DEFAULTS.CSV_PROPERTY_DELIMITER,
    objectDelimiter  : !options.objectDelimiter ? options.objectDelimiter : ConstantObj.DEFAULTS.CSV_OBJECT_DELIMITER,
  }
}

function parse(data){
  let parsed;
  try{
    parsed = JSON.parse(data);
  }catch(e){
    parsed = data || "";
  }
  return parsed;
}

function isJSObject(obj) {
  return typeof obj === 'object' ? obj : throwErr('Invalid data input');
}

module.exports = {
  convertToJSON,
  isFileLocationValid,
  getHeader,
  throwErr,
  toIterable,
  setDefaultOptions,
  isJSObject
};
