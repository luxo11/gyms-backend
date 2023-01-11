const express = require('express')
const { getGyms, getGym, filterGyms, addGym, getOwnedGyms, getOwnedGym, editOwnedGym, upload } = require('../controllers/gymController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.get('/', getGyms)
router.get('/filter', filterGyms)
router.get('/:id', getGym)


router.use(requireAuth)

router.post('/admin/add', upload.single('image'), addGym)
router.put('/admin/edit/:id', upload.single('image'), editOwnedGym)
router.get('/admin/get', getOwnedGyms)
router.get('/admin/get/:id', getOwnedGym)

module.exports = router