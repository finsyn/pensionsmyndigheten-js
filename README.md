# Pensionsmyndigheten PPM JS (unofficial)

Fetches some [public PPM fund data from Pensionsmyndigheten](https://www.pensionsmyndigheten.se/statistik-och-rapporter/statistik/statistik-for-premiepension#historiska_fondkurser).

## Usage
```javascript
npm i -s pensionsmyndigheten-ppm
```

```
const { getQuotes, getProfiles, getProfilesExt } = require('pensionsmyndigheten-ppm')
getQuotes()
  .then(console.log)

// [
//   {
//     internalId: '295857',
//     name: 'Skandia Time Global',
//     buy: 64.67,
//     sell: 4.66,
//     createdAt: new Date(2019-05-14)
//   },
//   ...
// ]
```

## Contributing
There are some tests inplace using mock-data. You can run the test suite with `npm test` to verify they go through.
