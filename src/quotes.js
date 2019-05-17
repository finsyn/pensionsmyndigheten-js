const { propOr, __, map, evolve, match, head, constructN, pipe,
        applySpec, dissoc, prop, assoc } = require('ramda')
const { emptyToNull, parseTime, parseQuote, parseStream } = require('./csv')

const colMap = {
  'Fondnr': 'internalId',
  'Fondnamn': 'name',
  'Köpkurs': 'buy',
  'Säljkurs': 'sell',
  'Kursdatum': 'createdAt'
}

const recordParser = pipe(
  map(emptyToNull),
  evolve({
    buy: parseQuote,
    sell: parseQuote,
    createdAt: parseTime
  })
)
const parse = stream => parseStream(stream, recordParser, colMap)

module.exports = parse


