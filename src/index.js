const { Readable } = require('stream');
const {
  convertToJSON, isFileLocationValid, toIterable, setDefaultOptions, generateLines,
} = require('./utils');
const ConstantObj = require('./constants');

class CsvParser {
  constructor(ip, optionValue) {
    // eslint-disable-next-line no-undef
    this.inputData = isFileLocationValid(ip) ? getData(ip) : ip;
    this.options = setDefaultOptions(optionValue);
  }

  getPropertDelimiter() {
    if (this.options.propertyDelimiter === undefined) {
      this.options.propertyDelimiter = ConstantObj.DEFAULTS.CSV_PROPERTY_DELIMITER;
    }
    return this.options.propertyDelimiter;
  }

  setPropertyDelimiter(newPropertyDelimiter) {
    this.options.propertyDelimiter = newPropertyDelimiter;
  }

  toJSON() {
    return Readable.from(
      convertToJSON(this.inputData, this.options),
    );
  }

  toCSV() {
    return Readable.from(generateLines(toIterable(this.inputData), this.options));
  }
}

module.exports = (inputObj, options) => new CsvParser(inputObj, options);
