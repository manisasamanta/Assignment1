const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true 
},
  options: [{ 
    text: String, 
    isCorrect: Boolean 
}],
  categories: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'category' 
}],
  createdAt: { 
    type: Date, 
    default: Date.now 
},
});

const Question = mongoose.model('question', questionSchema);
module.exports = Question