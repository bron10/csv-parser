// let count = 0;

// const myStream = new Readable({
//   read() {
//     let id = setTimeout(() => {
//       this.push(Math.random().toString());
//       count++;
//       console.log(count);
//       if (count === 10) {
//         console.log("inside count === 10");
//         this.push(null);
//         clearInterval(id);
//       }
//     }, 5);
//   },
//   objectMode: false,
// });

// myStream.pipe(process.stdout)

// setTimeout(() => {
//     myStream.on('data', chunk => {
//         console.log('data was called');
//         console.log(chunk.toString());
//     })
// }, 2000);

// myStream.on("readable", function () {
//   console.log("readable was called");
//   let chunk;
//   while (null !== (chunk = this.read())) {
//     console.log(chunk);
//   }
// });

async function printStream(streamObj) {
  for await (const chunk of streamObj) {
    // eslint-disable-next-line no-console
    console.log(chunk);
  }
}

const parser = require('../../src/index');

const csvString = `movieId,title,genres
1-Toy Story (1995)-Adventure|Animation|Children|Comedy|Fantasy
2-Jumanji (1995)-Adventure|Children|Fantasy
3-Grumpier Old Men (1995)-Comedy|Romance
4-Waiting to Exhale (1995)-Comedy|Drama|Romance
5-Father of the Bride Part II (1995)-Comedy`;

const parserObj = parser(
  { field_1: 'aaa', field_2: 'bbb', field_3: 'ccc' },
  {
    includeHeader: true,
  },
);
const processor = parserObj.toCSV();
printStream(processor);

const parsObj1 = parser(csvString, { includeHeader: true, header: ele => ele.toUpperCase(), propertyDelimiter: '-' });
// parsObj1.setPropertyDelimiter('-');
const processor1 = parsObj1.toJSON();
printStream(processor1);