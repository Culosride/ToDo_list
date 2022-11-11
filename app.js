import express from "express";
import day from "./date.js";
import mongoose from "mongoose";

// import and use the dirname() method from the path module.
// The dirname method takes a path as a parameter and returns the directory name of the path.
import path from "path";

// fileURLToPath method from the url module to get the filename.
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// const date = (path.join(__dirname, "date"));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/toDoListDB').
  catch(error => handleError(error));

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model('Item', itemsSchema);


const workList = [];
const today = day();


// regex to check if new entry is only white space or empty string
const regex = new RegExp("^$|^[ \t]+$");

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    err
      ? console.log(err)
      : res.render("list", { title: today, listName: "daily", items: foundItems});
    })
})

app.post("/", (req, res) => {
  const item = req.body.item
  const newItem = new Item({
    name: item
  })
  newItem.save()
  res.redirect("/")
  const list = req.body.list

  // if(regex.test(item)) {
  //   res.redirect(path.join("/", list==="work" ? list : ""))
  // } else {
  //   if(list === "work") {
  //     workList.push(item)
  //     res.redirect("/work")
  //   } else {
  //     newItem.save()
  //     res.redirect("/")
  //   }
  // }
})

app.get("/about", (req, res) => {
  res.render("about");
})

app.get("/work", (req, res) => {
  res.render("list", {title: "Work", listName: "work", items: workList});
})

app.listen(3000);
