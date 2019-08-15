const package = require('../package.json')
const express = require('express')
const router = express.Router()

router.get('/', function(req, res, next) {
  res.status(200);
  res.json({
    status: 200,
    version: package.version,
    msg: 'Welcome on the api of GarageISEP'
  })
})

module.exports = router
