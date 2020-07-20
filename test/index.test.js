const parser = require('../src/index');
const os = require("os");
const path = require('path');

describe('Test JSON to CSV', ()=>{
    test('String(JSON Object to CSV): stringified JSON input as a simple object', (done) => {
        const result = parser({"field_1": "aaa", "field_2": "bbb", "field_3": "ccc"}).toCSV()
        let chunk='';
        let expectedLines = 2;
        let lines = 0;
        result.on('data', (data) => {
            chunk+=data;
            ++lines;
        })
        .on('end', () => {
            expect(lines).toBe(expectedLines);
            done();
        })
    })

    test('String(JSON Array to CSV): stringified JSON input as a simple object', (done) => {
        const result = parser([{"field_1": "aaa", "field_2": "bbb", "field_3": "ccc"},
        {"field_1": "xxx", "field_2": "yyy", "field_3": "zzz"}]).toCSV()
        let chunk='';
        let expectedLines = 3;
        let lines = 0;
        result.on('data', (data) => {
            chunk+=data;
            ++lines;
        })
        .on('end', () => {
            expect(lines).toBe(expectedLines);
            done();
        })
    })

    test('String(JSON Array to CSV): Optional header as false ', (done) => {
        const result = parser([{"field_1": "aaa", "field_2": "bbb", "field_3": "ccc"},
        {"field_1": "xxx", "field_2": "yyy", "field_3": "zzz"}], {
            includeHeader : false
        }).toCSV()
        let chunk='';
        let expectedLines = 2;
        let lines = 0;
        result.on('data', (data) => {
            chunk+=data;
            ++lines;
        })
        .on('end', () => {
            // console.log
            expect(lines).toBe(expectedLines);
            done();
        })
    })

    test('String(JSON Array to CSV): Optional delimiter as false ', (done) => {
        let expectedOutput = `field_1;field_2;field_3${os.EOL}aaa;bbb;ccc${os.EOL}xxx;yyy;zzz${os.EOL}`;
        const result = parser([{"field_1": "aaa", "field_2": "bbb", "field_3": "ccc"},
        {"field_1": "xxx", "field_2": "yyy", "field_3": "zzz"}], {
            propertyDelimiter : ';'
        }).toCSV()
        let chunk='';
        result.on('data', (data) => {
            chunk+=data;
        })
        .on('end', () => {
            expect(chunk).toBe(expectedOutput);
            done();
        })
    })

    test('Stream File: stream input JSON to CSV', (done) => {
        let lines = '';
        const expectedLines = `field_1,field_2,field_3${os.EOL}aaa,bbb,ccc${os.EOL}`;
        parser(path.resolve(__dirname, 'b.json'))
        .on('data', (data) => {
            lines += data.toString();
            // console.log("data" , data.toString());
        })
        .on('end', () => {
            expect(lines).toBe(expectedLines);
            done();
        })
    })
})

describe('TEST CSV to JSON', () => {
    // const obj = csvParser();
    const csvString = `movieId,title,genres
1,Toy Story (1995),Adventure|Animation|Children|Comedy|Fantasy
2,Jumanji (1995),Adventure|Children|Fantasy
3,Grumpier Old Men (1995),Comedy|Romance
4,Waiting to Exhale (1995),Comedy|Drama|Romance
5,Father of the Bride Part II (1995),Comedy`;
    const incorrectCSVString = `movieId,title,genres
1,Toy Story (1995),Adventure|Animation|Children|Comedy|Fantasy
2,Jumanji (1995),Adventure|Children|Fantasy
3,Grumpier Old Men (1995),Comedy|Romance
4,Waiting to Exhale (1995),Comedy|Drama|Romance,test
5,Father of the Bride Part II (1995),Comedy`;
    const expectedJSONArray = [
      {
        movieId: '1',
        title: 'Toy Story (1995)',
        genres: 'Adventure|Animation|Children|Comedy|Fantasy',
      },
      {
        movieId: '2',
        title: 'Jumanji (1995)',
        genres: 'Adventure|Children|Fantasy',
      },
      {
        movieId: '3',
        title: 'Grumpier Old Men (1995)',
        genres: 'Comedy|Romance',
      },
      {
        movieId: '4',
        title: 'Waiting to Exhale (1995)',
        genres: 'Comedy|Drama|Romance',
      },
      {
        movieId: '5',
        title: 'Father of the Bride Part II (1995)',
        genres: 'Comedy',
      },
    ];
    test('String(CSV to JSON) : should return expected JSON object', (done) => {
        const result = parser(csvString).toJSON();
        const lines = []
        result.on('data', (data) => {
            lines.push(data);
        })
        .on('end', () => {
            expect(lines).toStrictEqual(expectedJSONArray);
            done();
        })    
    });

    test('String(CSV to JSON) : Optional header as false', (done) => {
        const result = parser(csvString, {includeHeader : false}).toJSON();
        const lines = []
        result.on('data', (data) => {
            lines.push(data);
        })
        .on('end', () => {
            // console.log("lines", lines);
            expect(lines).toStrictEqual([
                [
                "movieId",
                "title",
                "genres",
                ],
                [
                  '1',
                  'Toy Story (1995)',
                  'Adventure|Animation|Children|Comedy|Fantasy'
                ],
                [ '2', 'Jumanji (1995)', 'Adventure|Children|Fantasy' ],
                [ '3', 'Grumpier Old Men (1995)', 'Comedy|Romance' ],
                [ '4', 'Waiting to Exhale (1995)', 'Comedy|Drama|Romance' ],
                [ '5', 'Father of the Bride Part II (1995)', 'Comedy' ]
              ]);
            done();
        })    
    });

    test('String(CSV to JSON) : Optional header Function', (done) => {
        const result = parser(csvString, {header : ele => ele.toUpperCase()}).toJSON();
        const lines = []
        result.on('data', (data) => {
            lines.push(data);
        })
        .on('end', () => {
            expect(lines).toStrictEqual([
                {
                  MOVIEID: '1',
                  TITLE: 'Toy Story (1995)',
                  GENRES: 'Adventure|Animation|Children|Comedy|Fantasy'
                },
                {
                  MOVIEID: '2',
                  TITLE: 'Jumanji (1995)',
                  GENRES: 'Adventure|Children|Fantasy'
                },
                {
                  MOVIEID: '3',
                  TITLE: 'Grumpier Old Men (1995)',
                  GENRES: 'Comedy|Romance'
                },
                {
                  MOVIEID: '4',
                  TITLE: 'Waiting to Exhale (1995)',
                  GENRES: 'Comedy|Drama|Romance'
                },
                {
                  MOVIEID: '5',
                  TITLE: 'Father of the Bride Part II (1995)',
                  GENRES: 'Comedy'
                }
              ]);
            
          
            done();
        })    
    });

    test('Stream File: stream input CSV to JSON', (done) => {
        let lines = '';
        const expectedLines = JSON.stringify(expectedJSONArray);
        // let lines = ``;
        parser(path.resolve(__dirname, 'movies.csv'))
        .on('data', (data) => {
            lines += data.toString();
            // console.log("data" , data.toString());
        })
        .on('end', () => {
            // console.log("lines --> ", lines)
            expect(lines).toBe(expectedLines);
            done();
        })
    })
  });
  