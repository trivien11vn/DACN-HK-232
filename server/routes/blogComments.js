const router = require("express").Router();
const ctrls = require('../controllers/blogComment')
const {verifyAccessToken, isAdmin} = require('../middlewares/verify_token')

router.post('/get_comments',[verifyAccessToken, isAdmin], ctrls.getAllCommentsForBlog)
router.post('/add_comments',[verifyAccessToken, isAdmin], ctrls.createBlogComment)
router.post('/reply_comments',[verifyAccessToken, isAdmin], ctrls.replyBlogComment)

module.exports = router;