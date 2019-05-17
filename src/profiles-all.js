const xlsx = require('xlsx')
const { propOr, __, map, evolve, match, head, constructN, pipe,
        applySpec, dissoc, prop, assoc } = require('ramda')
const { emptyToNull, parseTime, headerToKeys, transform, parseBool } = require('./csv')
const CsvParse = require('csv-parse')

const getCreatedAt = pipe(
  match(/\d{4}-\d{2}-\d{2}/),
  head,
  constructN(1, Date)
)

const colMap = {
  // weird char expected here
  'FONDBOLAG': 'issuerName',
  'FONDNUMMER': 'internalId',
  'FONDNAMN': 'name',
  'VALUTA': 'currency',
  'FONDAVGIFT': 'feeDiscounted',
  ' AVGIFT FÖRE\n RABATT': 'fee',
  'KATEGORI': 'category',
  'EXTERID': 'isin',
  'FOND_I_FOND': 'isFundInFund',
  'RESULTATBEROENDE': 'isPerformanceFee',
  'SLOW': 'isSlow',
  'FÖRLÄNGD': 'isExtended',
  'STARTDATUM': 'tradingStartedAt',
  'AVSLUTSDATUM': 'tradingEndedAt',
  'FONDSTATUS': 'isActive'
}

const csvParse = CsvParse({
  delimiter: ',',
  from: 2,
  columns: headerToKeys(colMap),
  trim: true,
  bom: true
})

// seemingly some internal int
const activeMap = {
  '1': true
}
const parseActive = propOr(false, __, activeMap)

const recordParser = pipe(
  map(emptyToNull),
  evolve({
    isSlow: parseBool,
    fee: parseFloat,
    feeDiscounted: parseFloat,
    isFundInFund: parseBool,
    isExtended: parseBool,
    isPerformanceFee: parseBool,
    tradingEndedAt: parseTime,
    tradingStartedAt: parseTime,
    isActive: parseActive
  })
)

function parse(data) {
  const workbook = xlsx.read(data, {type:'buffer'})
  // seemingly always only one sheet
  const sheetName = workbook.SheetNames[0]
  const createdAt = getCreatedAt(sheetName)
  const sheet = workbook.Sheets[sheetName]
  const records = []
  const transformer = transform(recordParser)
  // to csv to be able to reuse tooling used for
  // the other PM files
  const stream = xlsx.stream.to_csv(sheet, { skipHidden: true })
      .pipe(csvParse)
      .pipe(transformer)
      .on('data', record => records.push(record))

  const end = new Promise((resolve, reject) => {
    stream.on('end', () => {
      console.log(`parsed ${records.length} records`)
      resolve({ createdAt, records })
    })
    stream.on('error', reject)
  })
  return end
}

module.exports = parse
