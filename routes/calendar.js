const package = require('../package.json')
const express = require('express')
const router = express.Router()

router.get('/', function(req, res, next) {
  res.status(200);
  res.json({
    status: 200,
    version: package.version,
    msg: 'Here you can find all of our events'
  })
})

module.exports = router