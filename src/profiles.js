const { emptyToNull, parseTime, parseStream } = require('./csv')
const { pipe, map, evolve } = require('ramda')

const colMap = {
  'Fondnr': 'internalId',
  'Fondnamn': 'name',
  'Fondkategori': 'category',
  '2019': '2019',
  '2018': '2018',
  '2017': '2017',
  'Snitt 5 år': 'medianYrs5',
  'Fondavgift (%)': 'feeDiscounted',
  'Risk senaste 36 mån': 'riskMonths36',
  'Beräknad': 'createdAtExtra'
}

const recordParser = pipe(
  map(emptyToNull),
  evolve({
    medianYrs5: parseInt,
    feeDiscounted: parseFloat,
    correction: parseInt,
    2019: parseInt,
    2018: parseInt,
    2017: parseInt,
    riskMonths36: parseInt,
    createdAtExtra: parseTime
  })
)

const parse = stream => parseStream(stream, recordParser, colMap)

module.exports = parse
