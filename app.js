//jshint esversion : 6
const express = require('express');
const bodyParser = require("body-parser");
const mongodb = require('mongodb')
const uri = "mongodb+srv://vaithi:simple@cluster0.0kq0w.mongodb.net/tasksDB?retryWrites=true&w=majority"
const mongoose = require('mongoose')
const app = express();
const _ = require('lodash')
const existingLists = []
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log("Connected to mongo server")) //Module related

const tasksSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name of task required!"]
    }
}) //Class creation
const listSchema = mongoose.Schema({
    name: String,
    items: [tasksSchema]
}) //Class creation

const Tasks = mongoose.model("task", tasksSchema) //Factory creation
const Lists = mongoose.model("list", listSchema) //Factory creation

const task1 = new Tasks({
    name: "Do the dishes"
})
const task2 = new Tasks({
    name: "Wash the car"
})
const task3 = new Tasks({
    name: "Finish HW"
}) //Document creation

// Tasks.insertMany([task1, task2, task3], function (err) {
//     if (err)
//         console.log(err)
//     else {
//         console.log("Items successfully pushed into DB");
//     }
// }) //Intial dummy inserts

app.set("view engine", "ejs"); //View Engine setting to EJS

app.use(bodyParser.urlencoded({
    extended: true
})); //Using bodyparser

app.use(express.static("public")); //Defining dir for static content

app.get("/", function (req, res) {
    Tasks.find({}, function (err, tasksList) {
        res.render("index", {
            kindOfDay: "hello&lt;user&gt;",
            newListItems: tasksList,
            nameOfList: "BaseList"
        })
    })
}) //GET req to root route

app.get("/about", function (req, res) {
    res.render("about");
}); //GET req to ABOUT route

app.post("/", function (req, res) {
    var item = new Tasks ({
        name: req.body.newItem
    });
    var listname = req.body.submit
    //Document
    if (listname === "BaseList") {
        item.save()
        res.redirect("/")
    } else {
        console.log("hahaaaaa")
        Lists.findOne({
            name: listname
        }, function (err, result) {
            if (!err) {
                let x = result.items
                x.push(item)
                result.save()
                console.log(x)
                res.redirect("/"+listname);
            } else
                console.log(err)
        })
    }
})


app.post("/about", function (req, res) {
    res.redirect("/");
}) //Post req to ABOUT route

app.post("/status", function (req, res) {
    const pathFrom = req.body.listname
  if(pathFrom==="BaseList")
  {
    Tasks.findByIdAndRemove(req.body.checkbox, {
        useFindAndModify: false
    }, function (err) {
        if (err)
            console.log(err)
        else
            console.log("Removed successfully")
    })
    res.redirect("/")
  }
  else 
  {
      Lists.findOneAndUpdate({name:pathFrom},{$pull:{items:{_id:req.body.checkbox}}},{useFindAndModify:false},function(err){
          if(err)
          console.log(err)
          else
          {console.log("Removed from"+pathFrom+"successfully")
      res.redirect("/"+pathFrom)
        }
      })
  }
   
   
}) //POST request to handle checkbox status 

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function (req, res) {
    console.log("Server started");
}); //Localhost setup

//Handling different routes
app.get("/:listname", function (req, res) {
    
    const customListName = _.kebabCase([string=req.params.listname])
    
    Lists.findOne({
        name: customListName
    }, function (err, result) {
        if (!err) {
            if (!result) {
                var list = new Lists({
                    name: customListName,
                    items: [task1, task2]
                })
               
              Lists.insertMany([list],function(err)
              {
                  if(err)
                  console.log(err)
                  else
                  console.log("Inserted successfully")
              })
                console.log(list.items)
                console.log("haha")
            } else {
                res.render("index", {
                    kindOfDay: result.name,
                    newListItems: result.items,
                    nameOfList: customListName
                })
            }
        } else
            console.log(err)
    })
})