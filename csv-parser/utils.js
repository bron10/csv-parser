const ConstantObj = require('./constants');

function getHeader(headerString) {
  return headerString.split(ConstantObj.DEFAULTS.CSV_PROPERTY_DELIMITER);
}

const convertToJSON = (csvString, propertyDelimiter, objectDelimiter) => {
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

module.export = {
  convertToJSON,
};
