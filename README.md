# Instructions 

Aim is to write a package which converts CSV text input into arrays or objects. You have to use streams to accomplish the task.

## Input
- Your input can be a file path, a string containing a CSV code, 

## Output
- Your output should be a stream so the pipe chain can continue unless overriden by the user. See below.

## Mandatory Features

### 1. Follows the Node.js streaming API best practices.
  - Use async iterators and generators wherever you can.

### 2. Parse CSV files

```js
YOUR_API("path to localFile/remote files (if you can do)", { ...YOUR OPTIONS });
```
### 3. Can convert JSON to CSV and vice-versa (Bruno)
```js
YOUR_API('JSON STRING') (Bruno)
//=> outputs CSV (via stream? or string?)
input -> processing the input -> output file(stream) or string
YOUR_API('CSV STRING') (Arpit)
//=> outputs JSON  (via stream? or string?)
```

**Note:** Every JSON may not be valid CSV. Ask the developer for how to fill the gaps.

### 4. Support delimiters, quotes and escape characters
- Ask yourself one question: **Does the separator have to be only a comma? Can it be other characters?**


## 5. Header row support
- There may be an OPTIONAL header line appearing as the first line of the file with the same format as normal records. This header will contain names corresponding to the fields in the file, and MUST contain the same number of fields as the records in the rest of the file.

```js
# INPUT
field_1,field_2,field_3¬
aaa,bbb,ccc¬
xxx,yyy,zzz¬

# OUTPUT (ignorting headers)
[ ["field_1", "field_2", "field_3"],
  ["aaa", "bbb", "ccc"],
  ["xxx", "yyy", "zzz"] ]

# OUTPUT (using headers)
[ {"field_1": "aaa", "field_2": "bbb", "field_3": "ccc"},
  {"field_1": "xxx", "field_2": "yyy", "field_3": "zzz"} ]
```

- Give the power of transforming the header if I don't like the existing headers.
```js
YOUR_API(`
"key_1","key_2"
"value 1","value 2"
`, {
  headers: header =>
    header.map( column => column.toUpperCase() )
})
//=>
// [{
//	KEY_1: 'value 1',
//	KEY_2: 'value 2'
// }]
```

### 6. Spaces are considered part of a field and MUST NOT be ignored


### 7. You should give the ability to skip the default stream return value.
- Perhaps by returning a promise that resolves with the entire output?
- Or by taking a callback which is invoked when the task is complete?

### 8. Should be able to handle errors, continue parsing even for ambiguous CSV's and return the errors for each row
- The user should be able to choose whether to stop on the first error, or skip the ill-formed line, or get an collection of all ill-formed lines at the end or something that you can think of.

### 9. Skip commented line
```js
const data = `
# At the begening of a record
"hello"
"world"# At the end of a record
`.trim()

YOUR_API(data)
// output
// [
//  [ "hello" ],
//  [ "world" ]
// ]
```

### 10. Test coverage
- Your API should be extensively tested using [Jest](https://jestjs.io/).

**Note:** `YOUR_API` can be a single function like `parse`. It can also be replaced with something like `CSV.parse`. Feel free to invent your own API.

## Extra Features (not mandatory)
- Make your library [Universal JavaScript](https://en.wikipedia.org/wiki/Isomorphic_JavaScript) (aka isomorphic JavaScript).
- Support worker thread by passing a config. That is, the computation will not happen on main thread but on worker threads.
- Auto detect the delimiter
```js
YOUR_API.detect(CSV_STRING)
//=> "\t"
```

## Restrictions
- You should not be using any extra libraries.
	- Apart from `eslint`, `prettier`, `babel` or other helper utilities.
- If your library is not using streams, it won't be evaluated.
- If your library does not have tests, it won't be evaluated.

## CSV Rules

- Take into account that the comma (,) character is not the only character used as a field delimiter. Semi-colons (;), tabs (\t), and more are also popular field delimiter characters.
- Each record starts at the beginning of its own line, and ends with a line break (shown as ¬)

```jsx
# INPUT
aaa,bbb,ccc¬
xxx,yyy,zzz¬

# OUTPUT
[ ["aaa", "bbb", "ccc"],
  ["xxx", "yyy", "zzz"] ]
```

- The last record in a file is not required to have a ending line break

```jsx
# INPUT
aaa ,  bbb , ccc¬
 xxx, yyy  ,zzz ¬

# OUTPUT
[ ["aaa ", "  bbb ", " ccc"],
  [" xxx", " yyy  ", "zzz "] ]
```

```jsx
// Two-line, comma-delimited file
var csv = myCSV.unparse([
	["1-1", "1-2", "1-3"],
	["2-1", "2-2", "2-3"]
]);
```

## Reference

[https://csv-spec.org/](https://csv-spec.org/)
