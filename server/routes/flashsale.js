const router = require('express').Router()
const ctrls = require('../controllers/flashsale')
const {verifyAccessToken, isAdmin} = require('../middlewares/verify_token')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewFlashSaleEvent)
router.get('/getFlashSalesByProviderId/:providerId', ctrls.getFlashSaleEventByProviderId)


module.exports = router