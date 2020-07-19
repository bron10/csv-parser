const csvParser = require('./index');

describe('csvToJsonConverter', () => {
  const obj = csvParser();
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
4,Waiting to Exhale (1995),Comedy|Drama|Romance, bhasad
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
  it('should return expected JSON object', () => {
    expect(obj.csvToJson(csvString)).toStrictEqual(expectedJSONArray);
  });
  it('should return correct object type', () => {
    expect(Array.isArray(obj.csvToJson(csvString))).toBe(true);
    expect(() => { obj.csvToJson('test'); }).toThrowError();
    expect(() => { obj.csvToJson(incorrectCSVString); }).toThrowError();
  });
});
