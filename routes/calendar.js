const package = require('../package.json')
const express = require('express')
const router = express.Router()

const asyncMiddleware = require('../utils/asyncMiddleware')

const calendar = require('../utils/googleapis/calendar/')
const calendars = require('../utils/googleapis/calendar/calendars.json')

router.get('/', function(req, res, next) {
  res.status(200)
  res.json({
    status: 200,
    version: package.version,
    msg: 'Here you can find all of our events'
  })
})

// Lister les calendriers
router.get('/calendarList/list', asyncMiddleware(async (req, res, next) => {
  res.status(200)
  res.json(await calendar.listPublicCalendars())
}))

// Lister tous les événements
router.post('/all/events', asyncMiddleware(async (req, res, next) => {
  res.status(200)
  res.json(await calendar.getAllEvents(calendars.map(calendar => calendar.id), {...req.body, maxEvents: 10}));  //TODO: maxEvents à modifier dynamiquement
}))

// Lister tous les événements d'un calendrier
router.post('/:calendarId/events', asyncMiddleware(async (req, res, next) => {
  res.status(200)
  res.json(await calendar.getEvents(req.params.calendarId, req.body))
}))

// Ajouter un participant à un événement
router.post('/:calendarId/events/:eventId/addParticipant', asyncMiddleware(async (req, res, next) => {
  try {
    response = await calendar.addParticipant(req.params.calendarId, req.params.eventId, req.body.email)
    res.status(200)
    res.json(response)
  } catch (e) {
    console.log(e)
    res.status(500)
    res.json({message: e.message})
  }
}))

module.exports = router