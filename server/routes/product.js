const router = require("express").Router();
const ctrls = require('../controllers/product')
const uploader = require('../config/cloudinary.config')


const {verifyAccessToken, isAdmin} = require('../middlewares/verify_token')

router.get('/', [verifyAccessToken, isAdmin], ctrls.getAllProductByAdmin)
router.post('/', [verifyAccessToken, isAdmin],uploader.fields([
    {
        name: 'images',
        maxCount: 10
    },
    {
        name: 'thumb',
        maxCount: 1
    }]), ctrls.createProduct)

    
router.get('/public', ctrls.getAllProduct)
router.get('/public/:provider_id', ctrls.getAllProductByProviderId)
router.put('/ratings', [verifyAccessToken], ctrls.ratings)
router.put('/update_hidden_status/:productId', [verifyAccessToken, isAdmin], ctrls.updateHiddenStatus)


router.put('/upload_image/:pid', [verifyAccessToken, isAdmin],uploader.fields('images', 10), ctrls.uploadImage)
router.get('/:pid', ctrls.getProduct)
router.put('/variant/:pid', [verifyAccessToken, isAdmin],uploader.fields([
    {
        name: 'images',
        maxCount: 10
    },
    {
        name: 'thumb',
        maxCount: 1
    }]), ctrls.addVariant)

router.put('/update_variant/:productId/:variantId', [verifyAccessToken, isAdmin],uploader.fields([
    {
        name: 'images',
        maxCount: 10
    },
    {
        name: 'thumb',
        maxCount: 1
    }]), ctrls.updateVariant)
    
router.put('/:pid', [verifyAccessToken, isAdmin],uploader.fields([
    {
        name: 'images',
        maxCount: 10
    },
    {
        name: 'thumb',
        maxCount: 1
    }]), ctrls.updateProduct)

router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct)

module.exports = router
