const express = require("express")
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js")
let day = date.getDate()
const mongoose = require('mongoose');
const _ = require("lodash")
app = express()
const port = 1000
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

mongoose.connect()
const itemsSchema = mongoose.Schema({
name : String
})
const Item  = mongoose.model("Item",itemsSchema)
const default_items = [
    new Item({ name : "sal"}),
    new Item({name : "sla"}),
    new Item({ name : "sla"}),
]

const listSchema = mongoose.Schema({
    name : String,
    items : [itemsSchema]
})
const List = mongoose.model("List", listSchema)
app.get("/favicon.ico", (req,res)=>{
    res.send("404")
})

app.get("/:customListName", async(req,res) => {
    const Items_bruto = await Item.find({});
    const customListName = _.capitalize(req.params.customListName)
    if (await List.findOne({name : customListName }) == null)
    {
        
        const render_list = new List({
            name : customListName,
            items : default_items
        })
        await render_list.save()
        res.redirect("/"+customListName)
    }
    else {
        
        const render_list = (await List.findOne({name : customListName }))
        res.render("list", {title:customListName, itemsList:render_list.items})
    }
});


app.post("/", async(req,res) => {
    list_name = req.body.list
    new_item = new Item({name: req.body.newItem})
    foundList = await List.findOne({name : list_name })
    try{
      foundList.items.push(new_item)
      foundList.save()
    }
    catch{
        "404"
    }
    res.redirect("/"+ list_name)

});

// app.get("/work", (req,res) =>{
//     res.render("list",{title:"Work", itemsList:workItems})
// })

app.get("/about", (req,res) =>{
    res.render("about")
})



app.post("/delete", async(req,res) => {
    let delete_item = Item.findById(req.body.checkbox)
    let list_name = req.body.listName
    let foundList = await List.findOne({name : list_name })
    await foundList.deleteOne(delete_item)
    res.redirect("/" + list_name)

});
app.listen(port,() => {
    console.log("ITs working")
})

