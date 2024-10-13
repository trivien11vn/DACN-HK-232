const router = require("express").Router();
const ctrls = require('../controllers/ServiceProvider.js')
const {verifyAccessToken, isAdmin} = require('../middlewares/verify_token')

router.post('/', ctrls.createServiceProvider)
router.get('/', ctrls.getAllServiceProvider)
router.put('/:spid', ctrls.updateServiceProvider)
router.get('/:spid', ctrls.getServiceProvider)
router.post('/qna', ctrls.addServiceProviderQuestion)
router.post('/owner', ctrls.getServiceProviderByOwnerId)

module.exports = router