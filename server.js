//npm install express mongoose ejs dotenv
//npm install --save-dev nodemon


// Declare variables
const express = require('express');
const app = express()
const PORT = 8500;
const mongoose = require('mongoose');
require('dotenv').config()
// Add model varible
const TodoTask = require('./models/todotask')

// Set middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

//Connect to Mongo/Mongoose
mongoose.connect(process.env.DB_CONNECTION, 
    {useNewUrlParser: true}, 
    () => {console.log('Connected to database!')}
)

// GET METHOD
app.get('/', async (req, res) => {
    try {
        TodoTask.find({}, (err, tasks) => {
            res.render("index.ejs", { todoTasks: tasks });
        })
    } catch (err) {
        if (err) return res.status(500).send({message: error.message});
    }
});

// POST METHOD
app.post('/', async (req, res) => {
    const todoTask = new TodoTask(
        {
            title: req.body.title,
            content: req.body.content
        }
    )
    try{
        await todoTask.save()
        console.log(todoTask)
        res.redirect('/')
    } catch (err) {
        if (err) return res.status(500).send(err)
        res.redirect('/')
    }
})

///UPDATE METHOD
app
.route("/edit/:id")
.get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
        res.render("edit.ejs", { todoTasks: tasks, idTask: id });
    });
})
.post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(
        id,
        {
            title: req.body.title,
            content: req.body.content
        },

        err => {
            if (err) return res.status(500).send(err);
            res.redirect("/");
        });
});

//DELETE MTETHOD
app
    .route("/remove/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndRemove(id, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

// START SERVER
app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`))