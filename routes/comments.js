const express = require('express')
const { getComments, addComment } = require('../controllers/commentController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.get('/:gymId', getComments)

router.use(requireAuth)

router.post('/', addComment)

module.exports = router