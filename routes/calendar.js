const package = require('../package.json')
const express = require('express')
const router = express.Router()

const asyncMiddleware = require('../utils/asyncMiddleware')

const calendar = require('../utils/googleapis/calendar/')

router.get('/', function(req, res, next) {
  res.status(200);
  res.json({
    status: 200,
    version: package.version,
    msg: 'Here you can find all of our events'
  })
})

router.get('/list', asyncMiddleware(async (req, res, next) => {
  res.status(200);
  res.json(await calendar.listPublicCalendars())
}))

module.exports = router