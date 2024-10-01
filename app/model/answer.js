const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
}, 
  question: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'question', 
    required: true 
},
  selectedOption: { 
    type: String, 
    required: true 
},
  submittedAt: { 
    type: Date, 
    default: Date.now 
},
});

const Answer = mongoose.model('answer', answerSchema);
module.exports = Answer
