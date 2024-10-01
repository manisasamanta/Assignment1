const transporter = require("../helper/mailer");
const Answer = require("../model/answer");
const Category = require("../model/category");
const User = require("../model/user");



class userController{

     signup = async (req, res) => {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        
        const token = jwt.sign({ email }, 'ktfrdjtfkuygukg', { expiresIn: '1h' });
        const verificationUrl = `http://localhost:3000/verify/${token}`;
        
        await transporter.sendMail({
          to: email,
          subject: 'Verify your email',
          html: `Please verify your email by clicking <a href="${verificationUrl}">here</a>`,
        });
      
        res.status(201).send('Signup successful, please verify your email');
      }

      // Email verification
    emailVerification = async (req, res) => {
        const { token } = req.params;
        try {
          const decoded = jwt.verify(token, 'ktfrdjtfkuygukg');
          await User.updateOne({ email: decoded.email }, { emailVerified: true });
          res.send('Email verified');
        } catch (err) {
          res.status(400).send('Invalid or expired token');
        }
      }

      // User login
      login = async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
          return res.status(401).send('Invalid credentials');
        }
        if (!user.emailVerified) {
          return res.status(403).send('Email not verified');
        }
        const token = jwt.sign({ email }, 'ktfrdjtfkuygukg');
        res.json({ token });
      }


      // View user profile
      profile = async (req, res) => {
        const { email } = req.user;
        const user = await User.findOne({ email });
        res.json(user);
      }


      // Edit user profile
      editProfile = async (req, res) => {
        const { email } = req.user;
        const { image } = req.file;
        await User.updateOne({ email }, { image });
        res.send('Profile updated');
      }

      // Get all categories
      allCategories = async (req, res) => {
        const categories = await Category.find();
        res.json(categories);
      }

      // List questions by category
      questionns_by_category = async (req, res) => {
        const { id } = req.params;
        const questions = await question.find({ categories: id });
        res.json(questions);
      }

      // Add questions in bulk
      add_question = async (req, res) => {
        const questions = [];
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (row) => questions.push(row))
          .on('end', async () => {
            await Question.insertMany(questions);
            fs.unlinkSync(req.file.path);
            res.send('Questions imported');
          });
      }


      // Submit answer
      submit_answer = async (req, res) => {
        const { userId, questionId, selectedOption } = req.body;
        const answer = new Answer({ user: userId, question: questionId, selectedOption });
        await answer.save();
        res.send('Answer submitted');
      }

      // Search by question
      search_by_question = async (req, res) => {
        const { questionId, userId } = req.query;
        const answers = await Answer.find({ question: questionId, user: userId });
        res.json(answers);
      }

      // List all categories with question count
      allCategories_with_question = async (req, res) => {
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
        res.json(result);
      }

}

module.exports = new userController()