const t = require('tap')
const parse = require('./profiles-all')
const fs = require('fs')

const mock = './mocks/lista-alla-fonder.xls'
t.test(async t => {
  const data = fs.readFileSync(mock)
  const { createdAt, records } = await parse(data)
  t.equals(createdAt.toISOString(), '2019-02-06T00:00:00.000Z')
  t.similar(
    // this is the first one we can see in the spreadsheet (visually)
    // for some reason
    records[0],
    {
      issuerName: 'Aberdeen Standard Investments Luxembourg S.A',
      internalId: '336115',
      name: 'Aberdeen Global - Asia Local Currency Short Duration Bond Fund',
      currency: 'USD',
      feeDiscounted: 0.38,
      fee: 1.31,
      category: 'Tillväxtmarknad ränta',
      isin: 'LU0094548533',
      isFundInFund: false,
      isPerformanceFee: false,
      isSlow: false,
      // isExtended:
      tradingStartedAt: null, 
      tradingEndedAt: null,
      isActive: true
    }
  )
  t.done()
})



