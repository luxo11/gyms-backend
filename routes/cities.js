const express = require('express')

const { getCities } = require('../controllers/cityController')

const router = express.Router()

router.get('/:city', getCities)

module.exports = router