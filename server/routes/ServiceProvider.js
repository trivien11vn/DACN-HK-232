const router = require("express").Router();
const ctrls = require('../controllers/ServiceProvider.js')
const {verifyAccessToken, isAdmin} = require('../middlewares/verify_token')
const uploader = require('../config/cloudinary.config')

router.post('/', uploader.fields([
    {
        name: 'avatar',
        maxCount: 1
    },
    {
        name: 'images',
        maxCount: 1
    },
]),ctrls.createServiceProvider)

router.put('/final_register/:token', ctrls.finalRegisterProvider)
router.get('/', ctrls.getAllServiceProvider)
router.put('/updatetheme/:spid', ctrls.updateServiceProviderTheme)
router.put('/:spid', ctrls.updateServiceProvider)
router.get('/getspbyad', [verifyAccessToken, isAdmin], ctrls.getServiceProviderByAdmin)
router.get('/:spid', ctrls.getServiceProvider)
router.post('/qna', ctrls.addServiceProviderQuestion)
router.post('/owner', ctrls.getServiceProviderByOwnerId)

module.exports = router