const t = require('tap')
const parse = require('./profiles')
const fs = require('fs')

const mock = './mocks/fonddata.csv'
t.test(async t => {
  const data = fs.createReadStream(mock)
  const results = await parse(data)
  t.similar(
    results[0], {
      '2017': -1,
      '2018': 5,
      '2019': 8,
      internalId: '336115',
      name: 'Aberdeen Standard SICAV I - Asia Local Currency Short Term Bond Fund',
      category: 'Tillväxtmarknad ränta',
      medianYrs5: 7,
      feeDiscounted: 0,
      riskMonths36: 7,
      createdAtExtra: new Date('2019-05-13T22:00:00.000Z')
    }
  )
  t.done()
})


