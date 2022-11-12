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

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/toDoListDB').
catch(error => handleError(error));

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('Item', itemsSchema);

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
})

const List = mongoose.model("List", listSchema);

const today = day();

// regex to check if new entry is only white space or empty string
const regex = new RegExp("^$|^[ \t]+$");

app.get("/about", (req, res) => {
  res.render("about");
})


app.get("/", (req, res) => {
  Item.find({list: "daily"}, (err, foundItems) => {
    err
    ? console.log(err)
    : res.render("list", { title: today, listName: "daily", items: foundItems});
  })
})

app.get("/:customList", (req, res) => {
  const customList = req.params.customList
  List.findOne({name: customList}, (err, found) => {
    if(!err) {
      if(!found) {
        const list = new List({
          name: customList,
          items: []
        })
        list.save()
        res.redirect(path.join("/", customList))
      } else {
        res.render("list", {title: found.name, listName: found.name, items: found.items})
      }
    } else {
      console.log(err)
    }
  })
})

app.post("/", (req, res) => {
  const item = req.body.item
  const list = req.body.list

  const newItem = new Item({
    name: item
  })

  if(regex.test(item)) {
    res.redirect(path.join("/", list != "daily" ? list : ""))
  } else {
    if(list === "daily") {
      newItem.save()
    } else {
      List.findOne({name: list}, (err, foundList) => {
        foundList.items.push(newItem)
        foundList.save()
      })
    }
    res.redirect(path.join("/", list != "daily" ? list : ""))
  }
})

app.post("/delete", (req, res) => {
  const id = req.body.delete
  const list = req.body.listName

  if(list === today) {
    Item.findByIdAndRemove(id, (err) => {
      if(!err) {
        res.redirect("/")
      }
    })
  } else {
    List.findOneAndUpdate( {name: list}, {$pull: {items: {_id: id}}}, (err) => {
      if(!err) res.redirect(path.join("/", list))
    })
  }

  // Item.findByIdAndRemove(id, (err) => {
  //   List.findOne({id : id}, (err, foundList) => {
  //     res.redirect(path.join("/", foundList.name))
  //   })
  //   err
  //     ? console.log(err)
  //     : console.log("Item deleted")
  // });
})


app.listen(3000);
