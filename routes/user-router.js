const userController = require('../controllers/user-controller')
const postController = require('../controllers/post-controller')
const router = require('express').Router()
const auth = require('../middleware/auth')


//For User
router.post('/register', userController.registerUser)

router.post('/login', userController.login)

router.post('/logout', auth, userController.logout)

router.get('/all-users', userController.getAllUsers)

router.get('/me', auth, userController.profile)

// router.get('/one-user/:id', userController.getOneUser)

// router.put('/update-user/:id', auth, userController.updateUser)

// router.delete('/delete-user/:id', auth, userController.deleteUser)

router.put('/update-profile', auth, userController.updateProfile)

router.delete('/delete-profile', auth, userController.deleteProfile)

router.get('/user-posts/:id', userController.userPosts)

router.get('/user-posts', userController.countUserPosts)

router.get('/user-age-above-18', userController.adultUser)

router.get('/desc-user-age', userController.maxToMinUsers)

router.get('/one-to-many', userController.oneToManyPost)

router.get('/inner-join', userController.innerJoin)

// router.post('/create-player', userController.createPlayerSkills)




//For Post
router.post('/add-post', auth, postController.addPost)

router.get('/all-posts', auth, postController.getAllPosts)

router.get('/posts', auth, postController.searchPost)

router.put('/update-post/:id', auth, postController.updatePost)

router.delete('/delete-post/:id', auth, postController.deletePost)

//Like

router.post('/add-like/:id', auth, postController.addLike)

router.delete('/delete-like/:id', auth, postController.deleteLike)

router.get('/likes/:id', auth, postController.countLikes)

//Comment

router.post('/add-comment/:id', auth, postController.addComment)

router.delete('/delete-comment/:id', auth, postController.deleteComment)

router.get('/all-comment/:id', auth, postController.allComments)





module.exports = router