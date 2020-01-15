const { google } = require('googleapis')

// configure a JWT auth client
let jwtClient = new google.auth.JWT(
    process.env.client_email,
    null,
    process.env.private_key.replace(/\\n/g, '\n'),
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
