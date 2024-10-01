const express = require('express');
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const upload = require('../utils/image');
const userController = require('../controller/apiController/userController');
const verifyToken = require('../middleware/auth');
// const csvUpload = require('../utils/csv')
const categoryController = require('../controller/apiController/categoryController');
const questionController = require('../controller/apiController/questionController');

const Router = express.Router();

// Configure multer for file uploads
const csvUpload = multer({
    dest: path.join(__dirname, 'public/csvuploads/')
});




//user controller

Router.post('/signup',upload.single('image'),userController.signup)
Router.get('/verify/:token',userController.verify_token)
Router.post('/login',userController.login)

Router.get('/profile',verifyToken,userController.profile)
Router.post('/edit/profile/:id',verifyToken,upload.single('image'),userController.edit_profile)


//category controller

Router.post('/create/category',categoryController.create_category)
Router.get('/all/categories',categoryController.all_categories)


//question controller

Router.post('/csv/addQuestion',csvUpload.single('file'),questionController.add_question);
Router.get('/listQuestion_for_eachCategory/:categoryId',questionController.listQuestion_for_eachCategory);

Router.post('/submit/answer',questionController.submit_answer)
Router.get('/search-by-question',verifyToken,questionController.search_by_question);
Router.get('/allCategories_with_question',verifyToken,questionController.allCategories_with_question);






module.exports = Router;