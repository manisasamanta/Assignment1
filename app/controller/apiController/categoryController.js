const Category = require("../../model/category");


class categoryController{

   // Create categories
   create_category = async (req, res) =>{
    try{
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();

        res.status(201).json({
            status: true,
            data:category,
            message:'Category created'
          })

    }catch(error){
        res.status(500).json({
            status:false,
            message:error.message
          });
    }
   }

   //get all categories
   all_categories = async (req, res) =>{
    try{
        const categories = await Category.find();

        res.status(201).json({
            status: true,
            data:categories,
            totalCategory:categories.length,
            message:'Categories fetched successfully'
          })
    }catch(error){
        res.status(500).json({
            status:false,
            message:error.message
          });
    }
   }




}

module.exports = new categoryController()