const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db/db.json');
const id = require('./helpers/uuid')

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// tells express to display the index.html when user navigates to endpt / by entering it to the url
app.get('/', (req, res) => {
    console.info(`received /${req.method} request to note taker home pg`);
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// tells express to display the notes.html when user navigates to endpt /notes by entering it to the url or by clicking the get started button
app.get('/notes', (req, res) => {
    console.info(`received /${req.method} request to notes pg`);
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// returns notes saved in the db
app.get('/api/notes', (req, res) => {
    console.info(`received /${req.method} request to load saved notes`);
    console.log(db);
    res.json(db);
});

//post request to save a new note, new note is saved but content is added outside of the []
app.post('/api/notes', (req, res) => {
    console.info(`received /${req.method} request to add note`);

    const { title, text } = req.body; //decontructs the body from client request

    if (title && text) { //creates a new object if there is a title and text content in the body
        const newNote = {
            title,
            text,
            id: id()
        };

        db.push(newNote); //pushes the new note into the json file

        //rewrites the json file where all the saved notes are with the new note added onto it
        fs.writeFile(`./db/db.json`, JSON.stringify(db), (err) => {
            err ? console.log(err) : (console.log(`New note "${newNote.title}" successfully added!`));
        });

        const response = {
            status: 'success',
            body: newNote
        };
        
        res.json(response);
    } else {
        res.status(500).json(`error, cannot post new note "${title}"`);
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const deletenote = req.params.id;
    console.info(`received /${req.method} request to delete note with id: ${deletenote}`);

    for (let i = 0; i < db.length; i++) {
        if (deletenote === db[i].id) {
            console.log(deletenote, db[i].id, deletenote === db[i].id);
            db.splice(i, 1);
            fs.writeFile(`./db/db.json`, JSON.stringify(db), (err) => {
                err ? console.log(err) : (console.log(`Note "${deletenote.title}" successfully deleted!`));
            });
            return res.json(db);
        } 
    }
    return res.json('failed to delete note');

});

app.listen(PORT, () =>
    console.log(`app listening to http://localhost:${PORT}`)
);