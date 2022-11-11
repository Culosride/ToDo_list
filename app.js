import express from "express";
import day from "./date.js"

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

const itemsList = [];
const workList = [];
const today = day();

app.get("/", (req, res) => {
  res.render("list", { title: today, listName: "daily", items: itemsList});
})

// regex to check if new entry is only white space or empty string
const regex = new RegExp("^$|^[ \t]+$");

app.post("/", (req, res) => {
  const item = req.body.item
  const list = req.body.list

  if(regex.test(item)) {
    res.redirect(path.join("/", list==="work" ? list : ""))
  } else {
    if(list === "work") {
      workList.push(item)
      res.redirect("/work")
    } else {
      itemsList.push(item)
      res.redirect("/")
    }
  }
})

app.get("/about", (req, res) => {
  res.render("about");
})

app.get("/work", (req, res) => {
  res.render("list", {title: "Work", listName: "work", items: workList});
})

app.listen(3000);
