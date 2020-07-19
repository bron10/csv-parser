const { convertToJSON, isFileLocationValid, throwErr, toIterable, setDefaultOptions} = require('./utils');
const { Readable } = require('stream');
const os = require("os");
const ConstantObj = require('./constants');

class CsvParser {
  constructor(ip, options) {
    this.inputData = isFileLocationValid(ip) ? getData(ip) : ip;
    this.options = setDefaultOptions(options);
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
  csvToJson() {
    return convertToJSON(this.fileLocation);
  }
  
  convertToJSON(){
    let data = getStreamData(this.fileLocation)
  }

  toCSV(){
    return Readable.from(this.generateLines(toIterable(this.inputData), this.options));
  }

  async * generateLines(parsedData, {propertyDelimiter, header}){
    let headerLine;
    for(const datum of parsedData){
      if(header && !headerLine) {
        const currentKeys = Object.keys(datum);
        headerLine = currentKeys.join(propertyDelimiter) + os.EOL;
        yield headerLine;
      }
      const line =  Object.values(datum).join(propertyDelimiter);
      yield line + os.EOL;
    }
    return null; 
  }
}

module.exports = (options) => new CsvParser(options);
