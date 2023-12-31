const express = require('express')
const router = express.Router()

const { getApiEvents, getOneApiEvent } = require('../controllers/api.controller')

router.get("/events", getApiEvents)

router.get("/events/:id", getOneApiEvent)

module.exports = router