const { google } = require('googleapis')
let privatekey = require('./privatekey.json.js')

// configure a JWT auth client
let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets',
     'https://www.googleapis.com/auth/drive',
     'https://www.googleapis.com/auth/calendar'])

// authenticate request
jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err)
  } else {
    console.log('Successfully connected!')
  }
})

// Google Calendar API
const calendar = google.calendar({
  version: 'v3',
  auth: jwtClient
})

// Export all
module.exports = {
  calendar
}
