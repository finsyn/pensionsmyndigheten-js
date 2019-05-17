const fetch = require('node-fetch')
const { urls } = require('./config')

// parsers for each file
const parseQuotes = require('./quotes')
const parseProfiles = require('./profiles')
const parseProfilesExt = require('./profiles-all')

const getQuotes = async function () {
  const response = await fetch(urls.quotes)
  return parseQuotes(response.body)
}

const getProfiles = async function () {
  const response = await fetch(urls.profiles)
  return parseProfiles(response.body)
}

const getProfilesExt = async function () {
  const response = await fetch(urls.profiles)
  const data = await response.buffer()
  return parseProfilesExt(data)
}

module.exports = {
  getQuotes,
  getProfiles,
  getProfilesExt
}
