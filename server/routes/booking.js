const router = require('express').Router()
const ctrls = require('../controllers/booking')
const {verifyAccessToken, isAdmin} = require('../middlewares/verify_token')

router.get('/',[verifyAccessToken], ctrls.getUserBookingsById) 

module.exports = router