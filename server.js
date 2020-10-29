const express = require("express");
const  path = require("path");
const fs = require('fs');
const shortid = require('shortid');
let db = require("./db/db.json");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


//HTML Routes
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});


//API Routes
app.get("/api/notes", function(req, res) {
    fs.readFile("./db/db.json", function (err, data) {
        if (err) throw (err);
        let notes = JSON.parse(data)
        return res.json(notes);
    })
});

//POST routes
app.post("/api/notes", function(req, res){
    let newNote = {
        id: shortid.generate(),
        title: req.body.title,
        text: req.body.text,
    };
    console.log(newNote);
    db.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(db), (err, data) => {
        if (err) throw (err);
        return res.json(db);
    });
});

app.delete("/api/notes/:id", (req, res) => {
    db = db.filter((note) => note.id !== req.params.id);
    console.log(db);
    fs.writeFile("./db/db.json", JSON.stringify(db), (err, data) => {
        if (err) throw (err);
        res.sendStatus(200);
    });
})

app.listen(PORT, function () {
    console.log("App listening on PORT, http://localhost:" + PORT);
});
