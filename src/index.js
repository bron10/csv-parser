const { Readable } = require('stream');
const {createReadStream} = require('fs');
const {
  convertToJSON, getHeader, isFile, parse, isCSVFile, toIterable, setDefaultOptions, generateLines,
} = require('./utils');
const { Transform } = require('stream');
const os = require("os");
const ConstantObj = require('./constants');

class CsvParser {
  constructor(ip, optionValue) {
    // eslint-disable-next-line no-undef
    this.inputData = ip;
    this.options = setDefaultOptions(optionValue);
    if(isFile(ip)){
      this.inputData = this.toStreamableFile(ip, isCSVFile(ip))
      return this.inputData;
    }
  }

  toStreamableFile(ip, isCSVFile){
    return createReadStream(ip)
    .pipe(this.transform(isCSVFile))
  }

  tranformJSONRow(chunk, cb, options){
    const {includeHeader, propertyDelimiter} = options;
    const parsedData = toIterable(chunk);
    let lines = '';
    let headerLine = '';
    for(let datum of parsedData){
      if(includeHeader && !headerLine){
        const currentKeys = Object.keys(datum);
        headerLine = currentKeys.join(propertyDelimiter) + os.EOL;
      }
      const line =  Object.values(datum).join(propertyDelimiter);
      lines += line + os.EOL;
    }
    return cb(null, headerLine + lines); 
  }


  transform(isCSVFile){
    const {tranformJSONRow, tranformCSVRow, options} = this;
    return new Transform({
      async transform(chunk, encoding, callback) {
        const transformRow = isCSVFile ? tranformCSVRow : tranformJSONRow; 
        transformRow(chunk.toString(), callback, options);
      }
    })
  }

  tranformCSVRow(csvString, callback, options) {
    const returnObj = [];
    const fieldDelimiter = options.propertyDelimiter;
    const header = options.header;
    const objectList = csvString.split(ConstantObj.DEFAULTS.CSV_RECORD_DELIMITER);
    if (objectList.length === 1) {
      throw Error();
    }
    const headerString = objectList.shift();
    const jsonFieldNames = getHeader(headerString, fieldDelimiter).map(header);
    if(!options.includeHeader){
      returnObj.push(jsonFieldNames);
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
    }
    return callback(null, JSON.stringify(returnObj));
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
