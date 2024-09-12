router = require('express').Router()
const ctrls = require('../controllers/blog')
const uploader = require('../config/cloudinary.config')
const {verifyAccessToken, isAdmin} = require('../middlewares/verify_token')

// router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog)
router.get('/tags', ctrls.getAllBlogTags)
router.post('/', ctrls.getAllBlogs)
router.get('/', ctrls.getBlogsBySearchTerm)
router.post('/create', ctrls.createNewBlogPost)
router.post('/create_tag', ctrls.createNewPostTag)
router.get('/:bid', ctrls.getBlog)
router.delete('/:bid',[verifyAccessToken, isAdmin], ctrls.deleteBlog)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.put('/like/:bid', [verifyAccessToken], ctrls.likeBlog)
router.put('/dislike/:bid', [verifyAccessToken], ctrls.dislikeBlog)
router.put('/upload_image/:bid', [verifyAccessToken, isAdmin],uploader.single('image'), ctrls.uploadImage)
router.post('/top_blogs', ctrls.getTopBlogs)
router.post('/top_tags', ctrls.getTopTags)
module.exports = router