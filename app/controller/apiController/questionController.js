const Question = require("../../model/question")
const csv = require('csvtojson')
const fs = require('fs')
const path = require('path')
const Category = require("../../model/category");
const Answer = require("../../model/answer");



class questionController {

    add_question = async (req, res) => {
        try {
            if (!req.file || !req.file.path) {
                return res.status(400).json({
                    status: false,
                    message: 'File not found'
                });
            }

            const questionsData = await csv().fromFile(req.file.path);
            const userData = [];

            const getCategoryId = async (name) => {
                if (!name) {
                    throw new Error('Category name is required');
                }
                
                let category = await Category.findOne({ name });
                if (!category) {
                    category = new Category({ name });
                    await category.save();
                }
                return category._id;
            };

            for (const data of questionsData) {
                const options = JSON.parse(data.options || '[]');
                const categoryId = await getCategoryId(data.categoryName);

                userData.push({
                    text: data.text,
                    options,
                    categories: [categoryId]
                });
            }

            const result = await Question.insertMany(userData);
            console.log('Questions successfully imported', result);

            res.status(200).json({
                message: "list of Questions",
                data: result
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    };




    // List questions for each category
    listQuestion_for_eachCategory = async (req, res) => {
        try {
            const categoryId = req.params.categoryId;
            const questions = await Question.find({ categories: categoryId });

            // If no questions are found
            if (questions.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: "No questions found for this category"
                });
            }

            res.status(200).json({
                message: "list of Questions",
                data: questions,
                totalQuestions:questions.length
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    }


// Submit answer
submit_answer = async (req, res) => {
    try{
        const { userId, questionId, selectedOption } = req.body;
        const answer = new Answer({ user: userId, question: questionId, selectedOption });
        await answer.save();

        res.status(200).json({
            message: "Answer submitted",
            data:answer
        })
    }catch(error){
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
  }


  search_by_question = async (req, res) => {
    try{
        const { questionId, userId } = req.query;
        const answers = await Answer.find({ question: questionId, user: userId });

        res.status(200).json({
            data:answers
        })
        
    }catch(error){
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
  }





  // List all categories with question count
  allCategories_with_question = async (req, res) => {
    try{
        const result = await Category.aggregate([
            {
              $lookup: {
                from: 'questions',
                localField: '_id',
                foreignField: 'categories',
                as: 'questions',
              },
            },
            {
              $project: {
                name: 1,
                questionCount: { $size: '$questions' },
              },
            },
          ]);
          res.status(200).json({
            data:result
        })
        
    }catch(error){
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
  }



}

module.exports = new questionController()