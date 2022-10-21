const express = require("express");
const sass = require("sass");
const path = require("path");
const app = express();
const date = require(path.join(__dirname, "date"));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));

const itemsList = [];
const workList = [];
const day = date.day();

app.get("/", (req, res) => {
  res.render("list", { title: day, listName: "daily", items: itemsList});
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
