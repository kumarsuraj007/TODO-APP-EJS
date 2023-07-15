const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", 'ejs');

mongoose 
.connect(process.env.MONGO_CONNECTION, {
       useNewUrlParser: true,
       useUnifiedTopology: true})   
.then(() => console.log("Database connected!"))
.catch(err => console.log(err));


const itemSchema = mongoose.Schema({
    name: String
});

const Item = mongoose.model('items', itemSchema);

// requests 
app.post('/', (req, res) => {
    var newTodo = req.body.newItem;
    const newTodoItem = new Item({
        name:newTodo
    });
    newTodoItem.save();
    res.redirect('/') 
});

app.post('/delete', (req, res) => {
    const checkedIdItems = req.body.checkbox;
    Item.findByIdAndDelete(checkedIdItems).then((function(err) {
        if(!err) {
            console.log('Successfully Deleted')
            res.redirect('/')
        }
    }))
});

app.get('/', async(req, res)=>{
    const todoListItems = await Item.find();
    res.render("list", { listTitle: "Today's List", newItems: todoListItems});
});

app.listen(4000, () => console.log('Server is running on port 4000!'));