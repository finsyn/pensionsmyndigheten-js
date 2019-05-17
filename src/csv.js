const CsvParse = require('csv-parse')
const { Transform } = require('stream')
const stream = require('stream')
const transform = require('stream-transform')
const { constructN, evolve, prop, __, pipe, toLower, tap,
        map, identity, isNil, ifElse, replace, invoker, isEmpty,
        always, propOr, multiply } = require('ramda')
const tz = require('timezone')
const seTz = tz(require('timezone/Europe/Stockholm'))(__, "Europe/Stockholm")
var iconv  = require('iconv-lite')

const parseTime = ifElse(
  isNil,
  identity,
  pipe(
    seTz,
    constructN(1, Date)
  )
)

// String -> Number
const parseQuote = pipe(
  replace(',', '.'),
  parseFloat
)

const emptyToNull = ifElse(
  isEmpty,
  always(null),
  identity
)

// skip columns we havent declared explicitly
const headerToKey = colMap => propOr(false, __, colMap)
const headerToKeys = colMap => map(headerToKey(colMap))
const transformer = recordParser => (record, callback) => {
  callback(null, recordParser(record))
}

const boolMap = {
  'J': true,
  'N': false,
  'Ja': true,
  'Nej': false,
  '0': false,
  '1': true
}

const parseBool = propOr(null, __, boolMap)

function parseRecords(recordParser) {
  return transform(
    transformer(recordParser),
    {
      parallel: 5
    }
  )
}

const csvParse = colMap => CsvParse({
  delimiter: ';',
  from: 1,
  columns: headerToKeys(colMap),
  trim: true
})

// ( ReadableStream, CSVRecord[] -> Record, Object ) -> Promise<Record[]>
function parseStream(data, recordParser, colMap) {
  const records = []
  const transformer = transform(recordParser)
  const stream = data
    // file -i mocks/kurser.csv 
    // mocks/fonddata.csv: text/plain; charset=iso-8859-1
    // latin1 is another name for this encoding
    // node stream default setEnconding('latin1') doesnt
    // seem to work with chunks
    .pipe(iconv.decodeStream('latin1'))
    .pipe(iconv.encodeStream('utf8'))
    .pipe(csvParse(colMap))
    .pipe(transformer)
    .on('data', record => records.push(record))

  const end = new Promise((resolve, reject) => {
    stream.on('end', () => {
      console.log(`parsed ${records.length} records`)
      resolve(records)
    })
    stream.on('error', reject)
  })
  return end
}

module.exports = {
  transform: parseRecords,
  headerToKeys,
  emptyToNull,
  parseBool,
  parseTime,
  parseStream,
  parseQuote,
  _parseTime: parseTime
}
