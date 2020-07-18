const { convertToJSON } = require('./utils');
const ConstantObj = require('./constants');

function isFileLocationValid() {
  return true;
}

// async function getData(inputObj) {
//   console.log('inside aync function ');
//   for await (const chunk of myStream) {
//     console.log(chunk);
//   }
// }

class CsvParser {
  constructor(fileLocation, options) {
    this.propertyDelimiter = options !== undefined && options.propertyDelimiter !== undefined
      ? options.propertyDelimiter : ConstantObj.DEFAULTS.CSV_PROPERTY_DELIMITER;
    this.objectDelimiter = options !== undefined && options.objectDelimiter !== undefined
      ? options.objectDelimiter : ConstantObj.DEFAULTS.CSV_OBJECT_DELIMITER;
    this.fileLocation = isFileLocationValid() ? fileLocation : '';
  }

  getPropertDelimiter() {
    if (this.propertyDelimiter === undefined) {
      this.propertyDelimiter = ConstantObj.DEFAULTS.CSV_PROPERTY_DELIMITER;
    }
    return this.propertyDelimiter;
  }

  setPropertyDelimiter(newPropertyDelimiter) {
    this.propertyDelimiter = newPropertyDelimiter;
  }

  // eslint-disable-next-line class-methods-use-this
  csvToJson(inputObj) {
    return convertToJSON(inputObj);
  }
}

module.exports = (options) => new CsvParser(options);
