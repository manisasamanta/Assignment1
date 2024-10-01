const express = require('express');
const userController = require('../app/controller/userController');
const upload = require('../utility/image');
const authencate = require('../app/middleware/auth');
const router = express.Router();


router.post('/signup',userController.signup)
router.get('/verify/:token',userController.emailVerification)
router.post('/login',userController.login)

router.post('/profile',authencate,userController.profile)
router.post('/editprofile',authencate,upload.single('image'),userController.editProfile)

router.get('/categories',userController.allCategories)
router.get('/categories/:id/questions',userController.questionns_by_category)

//csv
router.post('/questions/import',upload.single('csv'),userController.add_question)

router.post('/answers',userController.submit_answer)
router.get('/search',userController.search_by_question)
router.get('/categories/question-count',userController.allCategories_with_question)







module.exports = router;
